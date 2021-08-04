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
        // Resolvers
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnREFBK0M7QUFDL0Msd0NBQXVDO0FBQ3ZDLHdDQUF1QztBQUV2Qyw4Q0FBNkM7QUFDN0MsZ0RBQStDO0FBQy9DLHdDQUF1QztBQUN2QyxnREFBK0M7QUFDL0MsMkZBQXdGO0FBQ3hGLCtGQUE0RjtBQUc1RixNQUFhLHFCQUFzQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ2xELFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7O1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDhCQUE4QjtRQUM5QixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsMkJBQTJCLEVBQUUscUJBQXFCLENBQUMsQ0FBQTtRQUUxRyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUdoRSxxQkFBcUI7UUFDckIsTUFBTSxHQUFHLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDcEQsSUFBSSxFQUFFLHdCQUF3QjtZQUM5QixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsd0JBQXdCLENBQUM7WUFDMUQsbUJBQW1CLEVBQUU7Z0JBQ25CLG9CQUFvQixFQUFFO29CQUNwQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTztvQkFDcEQsWUFBWSxFQUFFO3dCQUNaLE9BQU8sRUFBRSx1QkFBVSxDQUFDLEtBQUssQ0FBQyxtQkFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMs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QUN0QixRQUFRLEVBQUUsT0FBTztZQUNqQixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDdEIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBbkxELHNEQW1MQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMnXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMidcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdAYXdzLWNkay9hd3MtcmRzJ1xuaW1wb3J0ICogYXMgbG4gZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYS1ub2RlanMnXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSdcbmltcG9ydCAqIGFzIGNvZ25pdG8gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZ25pdG8nXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSdcbmltcG9ydCAqIGFzIGNyIGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMnXG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gXCJAYXdzLWNkay9hd3MtYXBwc3luYy9ub2RlX21vZHVsZXMvQGF3cy1jZGsvY29yZS9saWIvZHVyYXRpb25cIjtcbmltcG9ydCB7IEV4cGlyYXRpb24gfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwcHN5bmMvbm9kZV9tb2R1bGVzL0Bhd3MtY2RrL2NvcmUvbGliL2V4cGlyYXRpb25cIjtcblxuXG5leHBvcnQgY2xhc3MgQW1pY2lpQmFja2VuZENka1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vSW1wb3J0IHVzZXJwb29sIGZyb24gQW1wbGlmeVxuICAgIGNvbnN0IHVzZXJQb29sID0gY29nbml0by5Vc2VyUG9vbC5mcm9tVXNlclBvb2xJZCh0aGlzLCAnYW1pY2lpLWFtbXBsaWZ5LXVzZXItcG9vbCcsICdldS13ZXN0LTJfNFhrVzE5Ym12JylcblxuICAgIG5ldyBjb2duaXRvLlVzZXJQb29sQ2xpZW50KHRoaXMsIFwiVXNlclBvb2xDbGllbnRcIiwgeyB1c2VyUG9vbCB9KVxuXG5cbiAgICAvLyBDcmVhdGUgR3JhcGhxbCBBcGlcbiAgICBjb25zdCBhcGkgPSBuZXcgYXBwc3luYy5HcmFwaHFsQXBpKHRoaXMsICdBbWljaWlBcGknLCB7XG4gICAgICBuYW1lOiAnY2RrLWFtaWNpaS1hcHBzeW5jLWFwaScsXG4gICAgICBzY2hlbWE6IGFwcHN5bmMuU2NoZW1hLmZyb21Bc3NldCgnZ3JhcGhxbC9zY2hlbWEuZ3JhcGhxbCcpLFxuICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xuICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICAgICAgYXBpS2V5Q29uZmlnOiB7XG4gICAgICAgICAgICBleHBpcmVzOiBFeHBpcmF0aW9uLmFmdGVyKER1cmF0aW9uLmRheXMoMzY1KSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IFt7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuVVNFUl9QT09MLFxuICAgICAgICAgIHVzZXJQb29sQ29uZmlnOiB7XG4gICAgICAgICAgICB1c2VyUG9vbFxuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9ncmFwaHFsRW5kcG9pbnQnLCB7XG4gICAgICB2YWx1ZTogYXBpLmdyYXBocWxVcmxcbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9hcGlrZXknLCB7XG4gICAgICB2YWx1ZTogYXBpLmFwaUtleSB8fCAnJ1xuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXdzX2FwcHN5bmNoX2F1dGhlbnRpY2F0aW9uVHlwZScsIHtcbiAgICAgIHZhbHVlOiAnQVBJX0tFWSdcbiAgICB9KVxuXG5cbiAgICAvL0NyZWF0ZSB0aGUgVlBDIGZvciB0aGUgU2VydmVybGVzc0RCIGNsdXN0ZXJcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnQW1pY2lpVlBDJywge1xuICAgICAgY2lkcjogJzEwLjAuMC4wLzIwJyxcbiAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgICAgbWF4QXpzOiAyLFxuICAgICAgZW5hYmxlRG5zSG9zdG5hbWVzOiB0cnVlLFxuICAgICAgZW5hYmxlRG5zU3VwcG9ydDogdHJ1ZSxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIGNpZHJNYXNrOiAyMixcbiAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjaWRyTWFzazogMjIsXG4gICAgICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVELFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KVxuXG5cbiAgICBjb25zdCBwcml2YXRlU2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ3ByaXZhdGUtc2cnLCB7XG4gICAgICB2cGMsXG4gICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ3ByaXZhdGUtc2cnLFxuICAgIH0pXG4gICAgcHJpdmF0ZVNnLmFkZEluZ3Jlc3NSdWxlKFxuICAgICAgcHJpdmF0ZVNnLFxuICAgICAgZWMyLlBvcnQuYWxsVHJhZmZpYygpLFxuICAgICAgJ2FsbG93IGludGVybmFsIFNHIGFjY2VzcydcbiAgICApXG5cbiAgICBjb25zdCBzdWJuZXRHcm91cCA9IG5ldyByZHMuU3VibmV0R3JvdXAodGhpcywgJ3Jkcy1zdWJuZXQtZ3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBzdWJuZXRHcm91cE5hbWU6ICdhdXJvcmEtc3VibmV0LWdyb3VwJyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBkZXNjcmlwdGlvbjogJ0FuIGFsbCBwcml2YXRlIHN1Ym5ldHMgZ3JvdXAgZm9yIHRoZSBEQicsXG4gICAgfSlcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgcmRzLlNlcnZlcmxlc3NDbHVzdGVyKHRoaXMsICdBdXJvcmFBbWljaWlDbHVzdGVyJywge1xuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VDbHVzdGVyRW5naW5lLkFVUk9SQV9NWVNRTCxcbiAgICAgIHBhcmFtZXRlckdyb3VwOiByZHMuUGFyYW1ldGVyR3JvdXAuZnJvbVBhcmFtZXRlckdyb3VwTmFtZSh0aGlzLCAnUGFyYW1ldGVyR3JvdXAnLCBcImRlZmF1bHQuYXVyb3JhLW15c3FsNS43XCIpLFxuICAgICAgZGVmYXVsdERhdGFiYXNlTmFtZTogJ0FtaWNpaURCJyxcbiAgICAgIGVuYWJsZURhdGFBcGk6IHRydWUsXG4gICAgICB2cGM6IHZwYyxcbiAgICAgIHN1Ym5ldEdyb3VwLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIHNjYWxpbmc6IHsgYXV0b1BhdXNlOiBEdXJhdGlvbi5zZWNvbmRzKDApIH1cbiAgICB9KVxuXG4gICAgY29uc3QgdXNlckZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnVXNlckZ1bmN0aW9uJywge1xuICAgICAgdnBjLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBjb2RlOiBuZXcgbGFtYmRhLkFzc2V0Q29kZSgnbGFtYmRhLWZucycpLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgU0VDUkVUX0FSTjogY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJyxcbiAgICAgICAgQVdTX05PREVKU19DT05ORUNUSU9OX1JFVVNFX0VOQUJMRUQ6ICcxJyxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIEdpdmUgYWNjZXNzIHRvIFNlY3JldCBNYW5hZ2VyXG4gICAgdXNlckZuLmFkZFRvUm9sZVBvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJ10sXG4gICAgICAgIHJlc291cmNlczogW2NsdXN0ZXIuc2VjcmV0Py5zZWNyZXRBcm4gfHwgJyddLFxuICAgICAgfSlcbiAgICApXG5cbiAgICBuZXcgZWMyLkludGVyZmFjZVZwY0VuZHBvaW50KHRoaXMsICdzZWNyZXRzLW1hbmFnZXInLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgIHZwYyxcbiAgICAgIHByaXZhdGVEbnNFbmFibGVkOiB0cnVlLFxuICAgICAgc3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgIH0pXG5cbiAgICBjb25zdCBsYW1iZGFEcyA9IGFwaS5hZGRMYW1iZGFEYXRhU291cmNlKCdsYW1iZGFEYXRhU291cmNlJywgdXNlckZuKVxuXG4gICAgLy8gU2V0dXAgZGF0YWJhc2VcblxuICAgIGNvbnN0IGRiU2V0dXBGbiA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0RiU2V0dXBGdW5jdGlvbicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJpdmF0ZVNnXSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgY29kZTogbmV3IGxhbWJkYS5Bc3NldENvZGUoJ2xhbWJkYS1mbnMnKSxcbiAgICAgIGhhbmRsZXI6ICdkYkZ1bmN0aW9uLmhhbmRsZXInLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgU0VDUkVUX0FSTjogY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJyxcbiAgICAgICAgQVdTX05PREVKU19DT05ORUNUSU9OX1JFVVNFX0VOQUJMRUQ6ICcxJyxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIGNsdXN0ZXIuZ3JhbnREYXRhQXBpQWNjZXNzKGRiU2V0dXBGbilcblxuICAgIGNvbnN0IGRiU2V0dXBDdXN0b21SZXNvdXJjZVByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKHRoaXMsICdkYlNldHVwQ3VzdG9tUmVzb3VyY2VQcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyOiBkYlNldHVwRm5cbiAgICB9KVxuXG4gICAgbmV3IGNkay5DdXN0b21SZXNvdXJjZSh0aGlzLCAnc2V0dXBDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogZGJTZXR1cEN1c3RvbVJlc291cmNlUHJvdmlkZXIuc2VydmljZVRva2VuXG4gICAgfSlcblxuXG4gICAgLy8gUmVzb2x2ZXJzXG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogJ1F1ZXJ5JyxcbiAgICAgIGZpZWxkTmFtZTogJ2dldENhbmRpZGF0ZXMnXG4gICAgfSlcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiAnUXVlcnknLFxuICAgICAgZmllbGROYW1lOiAnZ2V0TWF0Y2hlcydcbiAgICB9KVxuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6ICdNdXRhdGlvbicsXG4gICAgICBmaWVsZE5hbWU6ICdjcmVhdGVVc2VyJ1xuICAgIH0pXG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogJ011dGF0aW9uJyxcbiAgICAgIGZpZWxkTmFtZTogJ3VwZGF0ZVVzZXInXG4gICAgfSlcbiAgfVxufVxuIl19