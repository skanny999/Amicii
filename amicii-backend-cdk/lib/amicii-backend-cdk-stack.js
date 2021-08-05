"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmiciiBackendCdkStack = void 0;
const cdk = require("@aws-cdk/core");
const appsync = require("@aws-cdk/aws-appsync");
const ec2 = require("@aws-cdk/aws-ec2");
const rds = require("@aws-cdk/aws-rds");
const ln = require("@aws-cdk/aws-lambda-nodejs");
const lambda = require("@aws-cdk/aws-lambda");
const cognito = require("@aws-cdk/aws-cognito");
const iam = require("@aws-cdk/aws-iam");
const cr = require("@aws-cdk/custom-resources");
const path_1 = require("path");
const userFnPath = path_1.join(__dirname, '..', 'lambda-fns', 'index.ts');
const setupFnPath = path_1.join(__dirname, '..', 'lambda-fns', 'dbFunction.ts');
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
                        expires: cdk.Expiration.after(cdk.Duration.days(365))
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
            scaling: { autoPause: cdk.Duration.seconds(0) }
        });
        const userFn = new ln.NodejsFunction(this, 'UserFn', {
            vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
            securityGroups: [privateSg],
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'handler',
            entry: userFnPath,
            timeout: cdk.Duration.seconds(10),
            memorySize: 1024,
            environment: {
                SECRET_ARN: ((_a = cluster.secret) === null || _a === void 0 ? void 0 : _a.secretArn) || '',
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            },
            bundling: {
                nodeModules: ['@prisma/client', 'prisma'],
                commandHooks: {
                    beforeBundling(_inputDir, _outputDir) {
                        return [];
                    },
                    beforeInstall(_inputDir, outputDir) {
                        return [`cp -R ${path_1.join(__dirname, '..', 'lambda-fns', 'prisma')} ${outputDir}/`];
                    },
                    afterBundling(_inputDir, outputDir) {
                        return [
                            `cd ${outputDir}`,
                            `yarn prisma generate`,
                            `rm -rf node_modules/@prisma/engines`,
                            `rm -rf node_modules/@prisma/client/node_modules node_modules/.bin node_modules/prisma`,
                        ];
                    },
                },
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
        const dbSetupFn = new ln.NodejsFunction(this, 'DbSetupFunction', {
            vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
            securityGroups: [privateSg],
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'handler',
            entry: setupFnPath,
            timeout: cdk.Duration.seconds(10),
            memorySize: 1024,
            environment: {
                SECRET_ARN: ((_c = cluster.secret) === null || _c === void 0 ? void 0 : _c.secretArn) || '',
                AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            },
            bundling: {
                nodeModules: ['@prisma/client', 'prisma'],
                commandHooks: {
                    beforeBundling(_inputDir, _outputDir) {
                        return [];
                    },
                    beforeInstall(_inputDir, outputDir) {
                        return [`cp -R ${path_1.join(__dirname, '..', 'lambda-fns', 'prisma')} ${outputDir}/`];
                    },
                    afterBundling(_inputDir, outputDir) {
                        return [
                            `cd ${outputDir}`,
                            `yarn prisma generate`,
                            `rm -rf node_modules/@prisma/engines`,
                            `rm -rf node_modules/@prisma/client/node_modules node_modules/.bin node_modules/prisma`,
                        ];
                    },
                },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnREFBK0M7QUFDL0Msd0NBQXVDO0FBQ3ZDLHdDQUF1QztBQUN2QyxpREFBZ0Q7QUFDaEQsOENBQTZDO0FBQzdDLGdEQUErQztBQUMvQyx3Q0FBdUM7QUFDdkMsZ0RBQStDO0FBQy9DLCtCQUE0QjtBQUU1QixNQUFNLFVBQVUsR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbEUsTUFBTSxXQUFXLEdBQUcsV0FBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFBO0FBQ3hFLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsOEJBQThCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSwyQkFBMkIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFBO1FBRTFHLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBR2hFLHFCQUFxQjtRQUNyQixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNwRCxJQUFJLEVBQUUsd0JBQXdCO1lBQzlCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztZQUMxRCxtQkFBbUIsRUFB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O1lBQ3RCLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFNBQVMsRUFBRSxlQUFlO1NBQzNCLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDdEIsUUFBUSxFQUFFLE9BQU87WUFDakIsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUN0QixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQXpORCxzREF5TkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jJ1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInXG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnQGF3cy1jZGsvYXdzLXJkcydcbmltcG9ydCAqIGFzIGxuIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEtbm9kZWpzJ1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnXG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2duaXRvJ1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nXG5pbXBvcnQgKiBhcyBjciBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJ1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG5jb25zdCB1c2VyRm5QYXRoID0gam9pbihfX2Rpcm5hbWUsICcuLicsICdsYW1iZGEtZm5zJywgJ2luZGV4LnRzJylcbmNvbnN0IHNldHVwRm5QYXRoID0gam9pbihfX2Rpcm5hbWUsICcuLicsICdsYW1iZGEtZm5zJywgJ2RiRnVuY3Rpb24udHMnKVxuZXhwb3J0IGNsYXNzIEFtaWNpaUJhY2tlbmRDZGtTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvL0ltcG9ydCB1c2VycG9vbCBmcm9uIEFtcGxpZnlcbiAgICBjb25zdCB1c2VyUG9vbCA9IGNvZ25pdG8uVXNlclBvb2wuZnJvbVVzZXJQb29sSWQodGhpcywgJ2FtaWNpaS1hbW1wbGlmeS11c2VyLXBvb2wnLCAnZXUtd2VzdC0yXzRYa1cxOWJtdicpXG5cbiAgICBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCBcIlVzZXJQb29sQ2xpZW50XCIsIHsgdXNlclBvb2wgfSlcblxuXG4gICAgLy8gQ3JlYXRlIEdyYXBocWwgQXBpXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCAnQW1pY2lpQXBpJywge1xuICAgICAgbmFtZTogJ2Nkay1hbWljaWktYXBwc3luYy1hcGknLFxuICAgICAgc2NoZW1hOiBhcHBzeW5jLlNjaGVtYS5mcm9tQXNzZXQoJ2dyYXBocWwvc2NoZW1hLmdyYXBocWwnKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZLFxuICAgICAgICAgIGFwaUtleUNvbmZpZzoge1xuICAgICAgICAgICAgZXhwaXJlczogY2RrLkV4cGlyYXRpb24uYWZ0ZXIoY2RrLkR1cmF0aW9uLmRheXMoMzY1KSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IFt7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuVVNFUl9QT09MLFxuICAgICAgICAgIHVzZXJQb29sQ29uZmlnOiB7XG4gICAgICAgICAgICB1c2VyUG9vbFxuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9ncmFwaHFsRW5kcG9pbnQnLCB7XG4gICAgICB2YWx1ZTogYXBpLmdyYXBocWxVcmxcbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9hcGlrZXknLCB7XG4gICAgICB2YWx1ZTogYXBpLmFwaUtleSB8fCAnJ1xuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXdzX2FwcHN5bmNoX2F1dGhlbnRpY2F0aW9uVHlwZScsIHtcbiAgICAgIHZhbHVlOiAnQVBJX0tFWSdcbiAgICB9KVxuXG5cbiAgICAvL0NyZWF0ZSB0aGUgVlBDIGZvciB0aGUgU2VydmVybGVzc0RCIGNsdXN0ZXJcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnQW1pY2lpVlBDJywge1xuICAgICAgY2lkcjogJzEwLjAuMC4wLzIwJyxcbiAgICAgIG5hdEdhdGV3YXlzOiAwLFxuICAgICAgbWF4QXpzOiAyLFxuICAgICAgZW5hYmxlRG5zSG9zdG5hbWVzOiB0cnVlLFxuICAgICAgZW5hYmxlRG5zU3VwcG9ydDogdHJ1ZSxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIGNpZHJNYXNrOiAyMixcbiAgICAgICAgICBuYW1lOiAncHVibGljJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBjaWRyTWFzazogMjIsXG4gICAgICAgICAgbmFtZTogJ3ByaXZhdGUnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVELFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KVxuXG5cbiAgICBjb25zdCBwcml2YXRlU2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ3ByaXZhdGUtc2cnLCB7XG4gICAgICB2cGMsXG4gICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ3ByaXZhdGUtc2cnLFxuICAgIH0pXG4gICAgcHJpdmF0ZVNnLmFkZEluZ3Jlc3NSdWxlKFxuICAgICAgcHJpdmF0ZVNnLFxuICAgICAgZWMyLlBvcnQuYWxsVHJhZmZpYygpLFxuICAgICAgJ2FsbG93IGludGVybmFsIFNHIGFjY2VzcydcbiAgICApXG5cbiAgICBjb25zdCBzdWJuZXRHcm91cCA9IG5ldyByZHMuU3VibmV0R3JvdXAodGhpcywgJ3Jkcy1zdWJuZXQtZ3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBzdWJuZXRHcm91cE5hbWU6ICdhdXJvcmEtc3VibmV0LWdyb3VwJyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBkZXNjcmlwdGlvbjogJ0FuIGFsbCBwcml2YXRlIHN1Ym5ldHMgZ3JvdXAgZm9yIHRoZSBEQicsXG4gICAgfSlcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgcmRzLlNlcnZlcmxlc3NDbHVzdGVyKHRoaXMsICdBdXJvcmFBbWljaWlDbHVzdGVyJywge1xuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VDbHVzdGVyRW5naW5lLkFVUk9SQV9NWVNRTCxcbiAgICAgIHBhcmFtZXRlckdyb3VwOiByZHMuUGFyYW1ldGVyR3JvdXAuZnJvbVBhcmFtZXRlckdyb3VwTmFtZSh0aGlzLCAnUGFyYW1ldGVyR3JvdXAnLCBcImRlZmF1bHQuYXVyb3JhLW15c3FsNS43XCIpLFxuICAgICAgZGVmYXVsdERhdGFiYXNlTmFtZTogJ0FtaWNpaURCJyxcbiAgICAgIGVuYWJsZURhdGFBcGk6IHRydWUsXG4gICAgICB2cGM6IHZwYyxcbiAgICAgIHN1Ym5ldEdyb3VwLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIHNjYWxpbmc6IHsgYXV0b1BhdXNlOiBjZGsuRHVyYXRpb24uc2Vjb25kcygwKSB9XG4gICAgfSlcblxuICAgIGNvbnN0IHVzZXJGbiA9IG5ldyBsbi5Ob2RlanNGdW5jdGlvbih0aGlzLCAnVXNlckZuJywge1xuICAgICAgdnBjLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaGFuZGxlcicsXG4gICAgICBlbnRyeTogdXNlckZuUGF0aCxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIG1lbW9yeVNpemU6IDEwMjQsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBTRUNSRVRfQVJOOiBjbHVzdGVyLnNlY3JldD8uc2VjcmV0QXJuIHx8ICcnLFxuICAgICAgICBBV1NfTk9ERUpTX0NPTk5FQ1RJT05fUkVVU0VfRU5BQkxFRDogJzEnLFxuICAgICAgfSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIG5vZGVNb2R1bGVzOiBbJ0BwcmlzbWEvY2xpZW50JywgJ3ByaXNtYSddLFxuICAgICAgICBjb21tYW5kSG9va3M6IHtcbiAgICAgICAgICBiZWZvcmVCdW5kbGluZyhfaW5wdXREaXI6IHN0cmluZywgX291dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlZm9yZUluc3RhbGwoX2lucHV0RGlyOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW2BjcCAtUiAke2pvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLWZucycsICdwcmlzbWEnKX0gJHtvdXRwdXREaXJ9L2BdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZnRlckJ1bmRsaW5nKF9pbnB1dERpcjogc3RyaW5nLCBvdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgYGNkICR7b3V0cHV0RGlyfWAsXG4gICAgICAgICAgICAgIGB5YXJuIHByaXNtYSBnZW5lcmF0ZWAsXG4gICAgICAgICAgICAgIGBybSAtcmYgbm9kZV9tb2R1bGVzL0BwcmlzbWEvZW5naW5lc2AsXG4gICAgICAgICAgICAgIGBybSAtcmYgbm9kZV9tb2R1bGVzL0BwcmlzbWEvY2xpZW50L25vZGVfbW9kdWxlcyBub2RlX21vZHVsZXMvLmJpbiBub2RlX21vZHVsZXMvcHJpc21hYCxcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgLy8gR2l2ZSBhY2Nlc3MgdG8gU2VjcmV0IE1hbmFnZXJcbiAgICB1c2VyRm4uYWRkVG9Sb2xlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJ10sXG4gICAgICB9KVxuICAgIClcblxuICAgIG5ldyBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnQodGhpcywgJ3NlY3JldHMtbWFuYWdlcicsIHtcbiAgICAgIHNlcnZpY2U6IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgdnBjLFxuICAgICAgcHJpdmF0ZURuc0VuYWJsZWQ6IHRydWUsXG4gICAgICBzdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgfSlcblxuICAgIGNvbnN0IGxhbWJkYURzID0gYXBpLmFkZExhbWJkYURhdGFTb3VyY2UoJ2xhbWJkYURhdGFTb3VyY2UnLCB1c2VyRm4pXG5cbiAgICAvLyBTZXR1cCBkYXRhYmFzZVxuXG4gICAgY29uc3QgZGJTZXR1cEZuID0gbmV3IGxuLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdEYlNldHVwRnVuY3Rpb24nLCB7XG4gICAgICB2cGMsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGVudHJ5OiBzZXR1cEZuUGF0aCxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIG1lbW9yeVNpemU6IDEwMjQsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBTRUNSRVRfQVJOOiBjbHVzdGVyLnNlY3JldD8uc2VjcmV0QXJuIHx8ICcnLFxuICAgICAgICBBV1NfTk9ERUpTX0NPTk5FQ1RJT05fUkVVU0VfRU5BQkxFRDogJzEnLFxuICAgICAgfSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIG5vZGVNb2R1bGVzOiBbJ0BwcmlzbWEvY2xpZW50JywgJ3ByaXNtYSddLFxuICAgICAgICBjb21tYW5kSG9va3M6IHtcbiAgICAgICAgICBiZWZvcmVCdW5kbGluZyhfaW5wdXREaXI6IHN0cmluZywgX291dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlZm9yZUluc3RhbGwoX2lucHV0RGlyOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW2BjcCAtUiAke2pvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLWZucycsICdwcmlzbWEnKX0gJHtvdXRwdXREaXJ9L2BdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZnRlckJ1bmRsaW5nKF9pbnB1dERpcjogc3RyaW5nLCBvdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgYGNkICR7b3V0cHV0RGlyfWAsXG4gICAgICAgICAgICAgIGB5YXJuIHByaXNtYSBnZW5lcmF0ZWAsXG4gICAgICAgICAgICAgIGBybSAtcmYgbm9kZV9tb2R1bGVzL0BwcmlzbWEvZW5naW5lc2AsXG4gICAgICAgICAgICAgIGBybSAtcmYgbm9kZV9tb2R1bGVzL0BwcmlzbWEvY2xpZW50L25vZGVfbW9kdWxlcyBub2RlX21vZHVsZXMvLmJpbiBub2RlX21vZHVsZXMvcHJpc21hYCxcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgY2x1c3Rlci5ncmFudERhdGFBcGlBY2Nlc3MoZGJTZXR1cEZuKVxuXG4gICAgY29uc3QgZGJTZXR1cEN1c3RvbVJlc291cmNlUHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIodGhpcywgJ2RiU2V0dXBDdXN0b21SZXNvdXJjZVByb3ZpZGVyJywge1xuICAgICAgb25FdmVudEhhbmRsZXI6IGRiU2V0dXBGblxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkN1c3RvbVJlc291cmNlKHRoaXMsICdzZXR1cEN1c3RvbVJlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBkYlNldHVwQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5zZXJ2aWNlVG9rZW5cbiAgICB9KVxuXG5cbiAgICAvLyBSZXNvbHZlcnNcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiAnUXVlcnknLFxuICAgICAgZmllbGROYW1lOiAnZ2V0Q2FuZGlkYXRlcydcbiAgICB9KVxuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6ICdRdWVyeScsXG4gICAgICBmaWVsZE5hbWU6ICdnZXRNYXRjaGVzJ1xuICAgIH0pXG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogJ011dGF0aW9uJyxcbiAgICAgIGZpZWxkTmFtZTogJ2NyZWF0ZVVzZXInXG4gICAgfSlcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiAnTXV0YXRpb24nLFxuICAgICAgZmllbGROYW1lOiAndXBkYXRlVXNlcidcbiAgICB9KVxuICB9XG59XG4iXX0=