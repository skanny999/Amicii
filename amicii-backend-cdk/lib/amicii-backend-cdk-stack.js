"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmiciiBackendCdkStack = void 0;
const cdk = require("@aws-cdk/core");
const appsync = require("@aws-cdk/aws-appsync");
const ec2 = require("@aws-cdk/aws-ec2");
const rds = require("@aws-cdk/aws-rds");
const lambda = require("@aws-cdk/aws-lambda");
const cognito = require("@aws-cdk/aws-cognito");
const iam = require("@aws-cdk/aws-iam");
const cr = require("@aws-cdk/custom-resources");
const duration_1 = require("@aws-cdk/aws-appsync/node_modules/@aws-cdk/core/lib/duration");
const expiration_1 = require("@aws-cdk/aws-appsync/node_modules/@aws-cdk/core/lib/expiration");
class AmiciiBackendCdkStack extends cdk.Stack {
    constructor(scope, id, props) {
        var _a, _b, _c;
        super(scope, id, props);
        //Import userpool fron Amplify
        const userPool = cognito.UserPool.fromUserPoolId(this, 'amicii-ammplify-user-pool', 'eu-west-2_4XkW19bmv');
        new cognito.UserPoolClient(this, "UserPoolClient", { userPool });
        // Create Graphql Api
        const api = new appsync.GraphqlApi(this, 'AmiciiApi', {
            name: 'cdk-amicii-appsync-api',
            schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        expires: expiration_1.Expiration.after(duration_1.Duration.days(365))
                    }
                },
                additionalAuthorizationModes: [{
                        authorizationType: appsync.AuthorizationType.USER_POOL,
                        userPoolConfig: {
                            userPool
                        }
                    }]
            }
        });
        new cdk.CfnOutput(this, 'aws_appsynch_graphqlEndpoint', {
            value: api.graphqlUrl
        });
        new cdk.CfnOutput(this, 'aws_appsynch_apikey', {
            value: api.apiKey || ''
        });
        new cdk.CfnOutput(this, 'aws_appsynch_authenticationType', {
            value: 'API_KEY'
        });
        //Create the VPC for the ServerlessDB cluster
        const vpc = new ec2.Vpc(this, 'AmiciiVPC', {
            cidr: '10.0.0.0/20',
            natGateways: 0,
            maxAzs: 2,
            enableDnsHostnames: true,
            enableDnsSupport: true,
            subnetConfiguration: [
                {
                    cidrMask: 22,
                    name: 'public',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    cidrMask: 22,
                    name: 'private',
                    subnetType: ec2.SubnetType.ISOLATED,
                },
            ],
        });
        const privateSg = new ec2.SecurityGroup(this, 'private-sg', {
            vpc,
            securityGroupName: 'private-sg',
        });
        privateSg.addIngressRule(privateSg, ec2.Port.allTraffic(), 'allow internal SG access');
        const subnetGroup = new rds.SubnetGroup(this, 'rds-subnet-group', {
            vpc,
            subnetGroupName: 'aurora-subnet-group',
            vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            description: 'An all private subnets group for the DB',
        });
        const cluster = new rds.ServerlessCluster(this, 'AuroraAmiciiCluster', {
            engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
            parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', "default.aurora-mysql5.7"),
            defaultDatabaseName: 'AmiciiDB',
            enableDataApi: true,
            vpc: vpc,
            subnetGroup,
            securityGroups: [privateSg],
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            scaling: { autoPause: duration_1.Duration.seconds(0) }
        });
        const userFn = new lambda.Function(this, 'UserFunction', {
            vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
            securityGroups: [privateSg],
            runtime: lambda.Runtime.NODEJS_14_X,
            code: new lambda.AssetCode('lambda-fns'),
            handler: 'index.handler',
            memorySize: 1024,
            timeout: duration_1.Duration.seconds(10),
            environment: {
                SECRET_ARN: ((_a = cluster.secret) === null || _a === void 0 ? void 0 : _a.secretArn) || '',
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            },
        });
        // Give access to Secret Manager
        userFn.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['secretsmanager:GetSecretValue'],
            resources: [((_b = cluster.secret) === null || _b === void 0 ? void 0 : _b.secretArn) || ''],
        }));
        new ec2.InterfaceVpcEndpoint(this, 'secrets-manager', {
            service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
            vpc,
            privateDnsEnabled: true,
            subnets: { subnetType: ec2.SubnetType.ISOLATED },
            securityGroups: [privateSg],
        });
        const lambdaDs = api.addLambdaDataSource('lambdaDataSource', userFn);
        // Setup database
        const dbSetupFn = new lambda.Function(this, 'DbSetupFunction', {
            vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
            securityGroups: [privateSg],
            runtime: lambda.Runtime.NODEJS_14_X,
            code: new lambda.AssetCode('lambda-fns'),
            handler: 'dbFunction.handler',
            memorySize: 1024,
            timeout: duration_1.Duration.seconds(10),
            environment: {
                SECRET_ARN: ((_c = cluster.secret) === null || _c === void 0 ? void 0 : _c.secretArn) || '',
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            },
        });
        cluster.grantDataApiAccess(dbSetupFn);
        const dbSetupCustomResourceProvider = new cr.Provider(this, 'dbSetupCustomResourceProvider', {
            onEventHandler: dbSetupFn
        });
        new cdk.CustomResource(this, 'setupCustomResource', {
            serviceToken: dbSetupCustomResourceProvider.serviceToken
        });
        lambdaDs.createResolver({
            typeName: 'Query',
            fieldName: 'getCandidates'
        });
        lambdaDs.createResolver({
            typeName: 'Query',
            fieldName: 'getMatches'
        });
        lambdaDs.createResolver({
            typeName: 'Mutation',
            fieldName: 'createUser'
        });
        lambdaDs.createResolver({
            typeName: 'Mutation',
            fieldName: 'updateUser'
        });
    }
}
exports.AmiciiBackendCdkStack = AmiciiBackendCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnREFBK0M7QUFDL0Msd0NBQXVDO0FBQ3ZDLHdDQUF1QztBQUV2Qyw4Q0FBNkM7QUFDN0MsZ0RBQStDO0FBQy9DLHdDQUF1QztBQUN2QyxnREFBK0M7QUFDL0MsMkZBQXdGO0FBQ3hGLCtGQUE0RjtBQUc1RixNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2xELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7O1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDhCQUE4QjtRQUM5QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLEVBQUUscUJBQXFCLENBQUMsQ0FBQTtRQUUxRyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUdoRSxxQkFBcUI7UUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDcEQsSUFBSSxFQUFFLHdCQUF3QjtZQUM5QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUM7WUFDMUQsbUJBQW1CLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFO29CQUNwQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTztvQkFDcEQsWUFBWSxFQUFFO3dCQUNaLE9BQU8sRUFBRSx1QkFBVSxDQUFDLEtBQUssQ0FBQyxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMs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RUFBRSxPQUFPO1lBQ2pCLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDdEIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUN0QixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUFsTEQsc0RBa0xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYydcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJ1xuaW1wb3J0ICogYXMgcmRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yZHMnXG5pbXBvcnQgKiBhcyBsbiBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhLW5vZGVqcydcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJ1xuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0bydcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJ1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcydcbmltcG9ydCB7IER1cmF0aW9uIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1hcHBzeW5jL25vZGVfbW9kdWxlcy9AYXdzLWNkay9jb3JlL2xpYi9kdXJhdGlvblwiO1xuaW1wb3J0IHsgRXhwaXJhdGlvbiB9IGZyb20gXCJAYXdzLWNkay9hd3MtYXBwc3luYy9ub2RlX21vZHVsZXMvQGF3cy1jZGsvY29yZS9saWIvZXhwaXJhdGlvblwiO1xuXG5cbmV4cG9ydCBjbGFzcyBBbWljaWlCYWNrZW5kQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy9JbXBvcnQgdXNlcnBvb2wgZnJvbiBBbXBsaWZ5XG4gICAgY29uc3QgdXNlclBvb2wgPSBjb2duaXRvLlVzZXJQb29sLmZyb21Vc2VyUG9vbElkKHRoaXMsICdhbWljaWktYW1tcGxpZnktdXNlci1wb29sJywgJ2V1LXdlc3QtMl80WGtXMTlibXYnKVxuXG4gICAgbmV3IGNvZ25pdG8uVXNlclBvb2xDbGllbnQodGhpcywgXCJVc2VyUG9vbENsaWVudFwiLCB7IHVzZXJQb29sIH0pXG5cblxuICAgIC8vIENyZWF0ZSBHcmFwaHFsIEFwaVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ0FtaWNpaUFwaScsIHtcbiAgICAgIG5hbWU6ICdjZGstYW1pY2lpLWFwcHN5bmMtYXBpJyxcbiAgICAgIHNjaGVtYTogYXBwc3luYy5TY2hlbWEuZnJvbUFzc2V0KCdncmFwaHFsL3NjaGVtYS5ncmFwaHFsJyksXG4gICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuQVBJX0tFWSxcbiAgICAgICAgICBhcGlLZXlDb25maWc6IHtcbiAgICAgICAgICAgIGV4cGlyZXM6IEV4cGlyYXRpb24uYWZ0ZXIoRHVyYXRpb24uZGF5cygzNjUpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlczogW3tcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wsXG4gICAgICAgICAgdXNlclBvb2xDb25maWc6IHtcbiAgICAgICAgICAgIHVzZXJQb29sXG4gICAgICAgICAgfVxuICAgICAgICB9XVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXdzX2FwcHN5bmNoX2dyYXBocWxFbmRwb2ludCcsIHtcbiAgICAgIHZhbHVlOiBhcGkuZ3JhcGhxbFVybFxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXdzX2FwcHN5bmNoX2FwaWtleScsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpS2V5IHx8ICcnXG4gICAgfSlcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdhd3NfYXBwc3luY2hfYXV0aGVudGljYXRpb25UeXBlJywge1xuICAgICAgdmFsdWU6ICdBUElfS0VZJ1xuICAgIH0pXG5cblxuICAgIC8vQ3JlYXRlIHRoZSBWUEMgZm9yIHRoZSBTZXJ2ZXJsZXNzREIgY2x1c3RlclxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdBbWljaWlWUEMnLCB7XG4gICAgICBjaWRyOiAnMTAuMC4wLjAvMjAnLFxuICAgICAgbmF0R2F0ZXdheXM6IDAsXG4gICAgICBtYXhBenM6IDIsXG4gICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IHRydWUsXG4gICAgICBlbmFibGVEbnNTdXBwb3J0OiB0cnVlLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgY2lkck1hc2s6IDIyLFxuICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNpZHJNYXNrOiAyMixcbiAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pXG5cblxuICAgIGNvbnN0IHByaXZhdGVTZyA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAncHJpdmF0ZS1zZycsIHtcbiAgICAgIHZwYyxcbiAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiAncHJpdmF0ZS1zZycsXG4gICAgfSlcbiAgICBwcml2YXRlU2cuYWRkSW5ncmVzc1J1bGUoXG4gICAgICBwcml2YXRlU2csXG4gICAgICBlYzIuUG9ydC5hbGxUcmFmZmljKCksXG4gICAgICAnYWxsb3cgaW50ZXJuYWwgU0cgYWNjZXNzJ1xuICAgIClcblxuICAgIGNvbnN0IHN1Ym5ldEdyb3VwID0gbmV3IHJkcy5TdWJuZXRHcm91cCh0aGlzLCAncmRzLXN1Ym5ldC1ncm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHN1Ym5ldEdyb3VwTmFtZTogJ2F1cm9yYS1zdWJuZXQtZ3JvdXAnLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW4gYWxsIHByaXZhdGUgc3VibmV0cyBncm91cCBmb3IgdGhlIERCJyxcbiAgICB9KVxuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyByZHMuU2VydmVybGVzc0NsdXN0ZXIodGhpcywgJ0F1cm9yYUFtaWNpaUNsdXN0ZXInLCB7XG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUNsdXN0ZXJFbmdpbmUuQVVST1JBX01ZU1FMLFxuICAgICAgcGFyYW1ldGVyR3JvdXA6IHJkcy5QYXJhbWV0ZXJHcm91cC5mcm9tUGFyYW1ldGVyR3JvdXBOYW1lKHRoaXMsICdQYXJhbWV0ZXJHcm91cCcsIFwiZGVmYXVsdC5hdXJvcmEtbXlzcWw1LjdcIiksXG4gICAgICBkZWZhdWx0RGF0YWJhc2VOYW1lOiAnQW1pY2lpREInLFxuICAgICAgZW5hYmxlRGF0YUFwaTogdHJ1ZSxcbiAgICAgIHZwYzogdnBjLFxuICAgICAgc3VibmV0R3JvdXAsXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgc2NhbGluZzogeyBhdXRvUGF1c2U6IER1cmF0aW9uLnNlY29uZHMoMCkgfVxuICAgIH0pXG5cbiAgICBjb25zdCB1c2VyRm4gPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdVc2VyRnVuY3Rpb24nLCB7XG4gICAgICB2cGMsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGNvZGU6IG5ldyBsYW1iZGEuQXNzZXRDb2RlKCdsYW1iZGEtZm5zJyksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBTRUNSRVRfQVJOOiBjbHVzdGVyLnNlY3JldD8uc2VjcmV0QXJuIHx8ICcnLFxuICAgICAgICBBV1NfTk9ERUpTX0NPTk5FQ1RJT05fUkVVU0VfRU5BQkxFRDogJzEnLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgLy8gR2l2ZSBhY2Nlc3MgdG8gU2VjcmV0IE1hbmFnZXJcbiAgICB1c2VyRm4uYWRkVG9Sb2xlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJ10sXG4gICAgICB9KVxuICAgIClcblxuICAgIG5ldyBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnQodGhpcywgJ3NlY3JldHMtbWFuYWdlcicsIHtcbiAgICAgIHNlcnZpY2U6IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgdnBjLFxuICAgICAgcHJpdmF0ZURuc0VuYWJsZWQ6IHRydWUsXG4gICAgICBzdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgfSlcblxuICAgIGNvbnN0IGxhbWJkYURzID0gYXBpLmFkZExhbWJkYURhdGFTb3VyY2UoJ2xhbWJkYURhdGFTb3VyY2UnLCB1c2VyRm4pXG5cbiAgICAvLyBTZXR1cCBkYXRhYmFzZVxuXG4gICAgY29uc3QgZGJTZXR1cEZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRGJTZXR1cEZ1bmN0aW9uJywge1xuICAgICAgdnBjLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLkFzc2V0Q29kZSgnbGFtYmRhLWZucycpLFxuICAgICAgaGFuZGxlcjogJ2RiRnVuY3Rpb24uaGFuZGxlcicsXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgICAgdGltZW91dDogRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBTRUNSRVRfQVJOOiBjbHVzdGVyLnNlY3JldD8uc2VjcmV0QXJuIHx8ICcnLFxuICAgICAgICBBV1NfTk9ERUpTX0NPTk5FQ1RJT05fUkVVU0VfRU5BQkxFRDogJzEnLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgY2x1c3Rlci5ncmFudERhdGFBcGlBY2Nlc3MoZGJTZXR1cEZuKVxuXG4gICAgY29uc3QgZGJTZXR1cEN1c3RvbVJlc291cmNlUHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIodGhpcywgJ2RiU2V0dXBDdXN0b21SZXNvdXJjZVByb3ZpZGVyJywge1xuICAgICAgb25FdmVudEhhbmRsZXI6IGRiU2V0dXBGblxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkN1c3RvbVJlc291cmNlKHRoaXMsICdzZXR1cEN1c3RvbVJlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBkYlNldHVwQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5zZXJ2aWNlVG9rZW5cbiAgICB9KVxuXG5cblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiAnUXVlcnknLFxuICAgICAgZmllbGROYW1lOiAnZ2V0Q2FuZGlkYXRlcydcbiAgICB9KVxuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6ICdRdWVyeScsXG4gICAgICBmaWVsZE5hbWU6ICdnZXRNYXRjaGVzJ1xuICAgIH0pXG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogJ011dGF0aW9uJyxcbiAgICAgIGZpZWxkTmFtZTogJ2NyZWF0ZVVzZXInXG4gICAgfSlcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiAnTXV0YXRpb24nLFxuICAgICAgZmllbGROYW1lOiAndXBkYXRlVXNlcidcbiAgICB9KVxuICB9XG59XG4iXX0=