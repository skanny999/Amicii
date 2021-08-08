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
        new cdk.CfnOutput(this, 'aws_appsynch_region', {
            value: "eu-west-2"
        });
        new cdk.CfnOutput(this, 'aws_appsynch_authenticationType', {
            value: 'API_KEY'
        });
        new cdk.CfnOutput(this, 'aws_appsynch_apikey', {
            value: api.apiKey || ''
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
        const resolvers = [
            { typeName: 'Query', fieldName: 'user' },
            { typeName: 'Query', fieldName: 'candidates' },
            { typeName: 'Query', fieldName: 'matches' },
            { typeName: 'Mutation', fieldName: 'createUser' },
            { typeName: 'Mutation', fieldName: 'updateUser' },
            { typeName: 'Mutation', fieldName: 'likeUser' },
            { typeName: 'Mutation', fieldName: 'dislikeUser' }
        ];
        for (let { typeName, fieldName } of resolvers) {
            lambdaDs.createResolver({ typeName, fieldName });
        }
    }
}
exports.AmiciiBackendCdkStack = AmiciiBackendCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnREFBK0M7QUFDL0Msd0NBQXVDO0FBQ3ZDLHdDQUF1QztBQUN2QyxpREFBZ0Q7QUFDaEQsOENBQTZDO0FBQzdDLGdEQUErQztBQUMvQyx3Q0FBdUM7QUFDdkMsZ0RBQStDO0FBQy9DLCtCQUE0QjtBQUU1QixNQUFNLFVBQVUsR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbEUsTUFBTSxXQUFXLEdBQUcsV0FBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFBO0FBQ3hFLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsOEJBQThCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSwyQkFBMkIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFBO1FBRTFHLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBR2hFLHFCQUFxQjtRQUNyQixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNwRCxJQUFJLEVBQUUsd0JBQXdCO1lBQzlCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztZQUMxRCxtQkFBbUIsRUFB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LEVBQUU7WUFDbEQsWUFBWSxFQUFFLDZCQUE2QixDQUFDLFlBQVk7U0FDekQsQ0FBQyxDQUFBO1FBR0YsWUFBWTtRQUVaLE1BQU0sU0FBUyxHQUFHO1lBQ2hCLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO1lBQ3hDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO1lBQzlDLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFO1lBQzNDLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO1lBQ2pELEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFO1lBQ2pELEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFO1lBQy9DLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFO1NBQ25ELENBQUE7UUFFRCxLQUFNLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksU0FBUyxFQUFFO1lBQzlDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtTQUNqRDtJQUNILENBQUM7Q0FDRjtBQXhORCxzREF3TkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jJ1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInXG5pbXBvcnQgKiBhcyByZHMgZnJvbSAnQGF3cy1jZGsvYXdzLXJkcydcbmltcG9ydCAqIGFzIGxuIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEtbm9kZWpzJ1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnXG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2duaXRvJ1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nXG5pbXBvcnQgKiBhcyBjciBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJ1xuaW1wb3J0IHsgam9pbiB9IGZyb20gJ3BhdGgnO1xuXG5jb25zdCB1c2VyRm5QYXRoID0gam9pbihfX2Rpcm5hbWUsICcuLicsICdsYW1iZGEtZm5zJywgJ2luZGV4LnRzJylcbmNvbnN0IHNldHVwRm5QYXRoID0gam9pbihfX2Rpcm5hbWUsICcuLicsICdsYW1iZGEtZm5zJywgJ2RiRnVuY3Rpb24udHMnKVxuZXhwb3J0IGNsYXNzIEFtaWNpaUJhY2tlbmRDZGtTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvL0ltcG9ydCB1c2VycG9vbCBmcm9uIEFtcGxpZnlcbiAgICBjb25zdCB1c2VyUG9vbCA9IGNvZ25pdG8uVXNlclBvb2wuZnJvbVVzZXJQb29sSWQodGhpcywgJ2FtaWNpaS1hbW1wbGlmeS11c2VyLXBvb2wnLCAnZXUtd2VzdC0yXzRYa1cxOWJtdicpXG5cbiAgICBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCBcIlVzZXJQb29sQ2xpZW50XCIsIHsgdXNlclBvb2wgfSlcblxuXG4gICAgLy8gQ3JlYXRlIEdyYXBocWwgQXBpXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCAnQW1pY2lpQXBpJywge1xuICAgICAgbmFtZTogJ2Nkay1hbWljaWktYXBwc3luYy1hcGknLFxuICAgICAgc2NoZW1hOiBhcHBzeW5jLlNjaGVtYS5mcm9tQXNzZXQoJ2dyYXBocWwvc2NoZW1hLmdyYXBocWwnKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZLFxuICAgICAgICAgIGFwaUtleUNvbmZpZzoge1xuICAgICAgICAgICAgZXhwaXJlczogY2RrLkV4cGlyYXRpb24uYWZ0ZXIoY2RrLkR1cmF0aW9uLmRheXMoMzY1KSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IFt7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuVVNFUl9QT09MLFxuICAgICAgICAgIHVzZXJQb29sQ29uZmlnOiB7XG4gICAgICAgICAgICB1c2VyUG9vbFxuICAgICAgICAgIH1cbiAgICAgICAgfV1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9ncmFwaHFsRW5kcG9pbnQnLCB7XG4gICAgICB2YWx1ZTogYXBpLmdyYXBocWxVcmxcbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9yZWdpb24nLCB7XG4gICAgICB2YWx1ZTogXCJldS13ZXN0LTJcIlxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXdzX2FwcHN5bmNoX2F1dGhlbnRpY2F0aW9uVHlwZScsIHtcbiAgICAgIHZhbHVlOiAnQVBJX0tFWSdcbiAgICB9KVxuICAgIFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdhd3NfYXBwc3luY2hfYXBpa2V5Jywge1xuICAgICAgdmFsdWU6IGFwaS5hcGlLZXkgfHwgJydcbiAgICB9KVxuXG5cblxuICAgIC8vQ3JlYXRlIHRoZSBWUEMgZm9yIHRoZSBTZXJ2ZXJsZXNzREIgY2x1c3RlclxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdBbWljaWlWUEMnLCB7XG4gICAgICBjaWRyOiAnMTAuMC4wLjAvMjAnLFxuICAgICAgbmF0R2F0ZXdheXM6IDAsXG4gICAgICBtYXhBenM6IDIsXG4gICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IHRydWUsXG4gICAgICBlbmFibGVEbnNTdXBwb3J0OiB0cnVlLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgY2lkck1hc2s6IDIyLFxuICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNpZHJNYXNrOiAyMixcbiAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pXG5cblxuICAgIGNvbnN0IHByaXZhdGVTZyA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cCh0aGlzLCAncHJpdmF0ZS1zZycsIHtcbiAgICAgIHZwYyxcbiAgICAgIHNlY3VyaXR5R3JvdXBOYW1lOiAncHJpdmF0ZS1zZycsXG4gICAgfSlcbiAgICBwcml2YXRlU2cuYWRkSW5ncmVzc1J1bGUoXG4gICAgICBwcml2YXRlU2csXG4gICAgICBlYzIuUG9ydC5hbGxUcmFmZmljKCksXG4gICAgICAnYWxsb3cgaW50ZXJuYWwgU0cgYWNjZXNzJ1xuICAgIClcblxuICAgIGNvbnN0IHN1Ym5ldEdyb3VwID0gbmV3IHJkcy5TdWJuZXRHcm91cCh0aGlzLCAncmRzLXN1Ym5ldC1ncm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHN1Ym5ldEdyb3VwTmFtZTogJ2F1cm9yYS1zdWJuZXQtZ3JvdXAnLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnQW4gYWxsIHByaXZhdGUgc3VibmV0cyBncm91cCBmb3IgdGhlIERCJyxcbiAgICB9KVxuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyByZHMuU2VydmVybGVzc0NsdXN0ZXIodGhpcywgJ0F1cm9yYUFtaWNpaUNsdXN0ZXInLCB7XG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUNsdXN0ZXJFbmdpbmUuQVVST1JBX01ZU1FMLFxuICAgICAgcGFyYW1ldGVyR3JvdXA6IHJkcy5QYXJhbWV0ZXJHcm91cC5mcm9tUGFyYW1ldGVyR3JvdXBOYW1lKHRoaXMsICdQYXJhbWV0ZXJHcm91cCcsIFwiZGVmYXVsdC5hdXJvcmEtbXlzcWw1LjdcIiksXG4gICAgICBkZWZhdWx0RGF0YWJhc2VOYW1lOiAnQW1pY2lpREInLFxuICAgICAgZW5hYmxlRGF0YUFwaTogdHJ1ZSxcbiAgICAgIHZwYzogdnBjLFxuICAgICAgc3VibmV0R3JvdXAsXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgc2NhbGluZzogeyBhdXRvUGF1c2U6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDApIH1cbiAgICB9KVxuXG4gICAgY29uc3QgdXNlckZuID0gbmV3IGxuLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdVc2VyRm4nLCB7XG4gICAgICB2cGMsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGVudHJ5OiB1c2VyRm5QYXRoLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFNFQ1JFVF9BUk46IGNsdXN0ZXIuc2VjcmV0Py5zZWNyZXRBcm4gfHwgJycsXG4gICAgICAgIEFXU19OT0RFSlNfQ09OTkVDVElPTl9SRVVTRV9FTkFCTEVEOiAnMScsXG4gICAgICB9LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgbm9kZU1vZHVsZXM6IFsnQHByaXNtYS9jbGllbnQnLCAncHJpc21hJ10sXG4gICAgICAgIGNvbW1hbmRIb29rczoge1xuICAgICAgICAgIGJlZm9yZUJ1bmRsaW5nKF9pbnB1dERpcjogc3RyaW5nLCBfb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVmb3JlSW5zdGFsbChfaW5wdXREaXI6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbYGNwIC1SICR7am9pbihfX2Rpcm5hbWUsICcuLicsICdsYW1iZGEtZm5zJywgJ3ByaXNtYScpfSAke291dHB1dERpcn0vYF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFmdGVyQnVuZGxpbmcoX2lucHV0RGlyOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICBgY2QgJHtvdXRwdXREaXJ9YCxcbiAgICAgICAgICAgICAgYHlhcm4gcHJpc21hIGdlbmVyYXRlYCxcbiAgICAgICAgICAgICAgYHJtIC1yZiBub2RlX21vZHVsZXMvQHByaXNtYS9lbmdpbmVzYCxcbiAgICAgICAgICAgICAgYHJtIC1yZiBub2RlX21vZHVsZXMvQHByaXNtYS9jbGllbnQvbm9kZV9tb2R1bGVzIG5vZGVfbW9kdWxlcy8uYmluIG5vZGVfbW9kdWxlcy9wcmlzbWFgLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICAvLyBHaXZlIGFjY2VzcyB0byBTZWNyZXQgTWFuYWdlclxuICAgIHVzZXJGbi5hZGRUb1JvbGVQb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgYWN0aW9uczogWydzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZSddLFxuICAgICAgICByZXNvdXJjZXM6IFtjbHVzdGVyLnNlY3JldD8uc2VjcmV0QXJuIHx8ICcnXSxcbiAgICAgIH0pXG4gICAgKVxuXG4gICAgbmV3IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludCh0aGlzLCAnc2VjcmV0cy1tYW5hZ2VyJywge1xuICAgICAgc2VydmljZTogZWMyLkludGVyZmFjZVZwY0VuZHBvaW50QXdzU2VydmljZS5TRUNSRVRTX01BTkFHRVIsXG4gICAgICB2cGMsXG4gICAgICBwcml2YXRlRG5zRW5hYmxlZDogdHJ1ZSxcbiAgICAgIHN1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJpdmF0ZVNnXSxcbiAgICB9KVxuXG4gICAgY29uc3QgbGFtYmRhRHMgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZSgnbGFtYmRhRGF0YVNvdXJjZScsIHVzZXJGbilcblxuICAgIC8vIFNldHVwIGRhdGFiYXNlXG5cbiAgICBjb25zdCBkYlNldHVwRm4gPSBuZXcgbG4uTm9kZWpzRnVuY3Rpb24odGhpcywgJ0RiU2V0dXBGdW5jdGlvbicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJpdmF0ZVNnXSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgZW50cnk6IHNldHVwRm5QYXRoLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFNFQ1JFVF9BUk46IGNsdXN0ZXIuc2VjcmV0Py5zZWNyZXRBcm4gfHwgJycsXG4gICAgICAgIEFXU19OT0RFSlNfQ09OTkVDVElPTl9SRVVTRV9FTkFCTEVEOiAnMScsXG4gICAgICB9LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgbm9kZU1vZHVsZXM6IFsnQHByaXNtYS9jbGllbnQnLCAncHJpc21hJ10sXG4gICAgICAgIGNvbW1hbmRIb29rczoge1xuICAgICAgICAgIGJlZm9yZUJ1bmRsaW5nKF9pbnB1dERpcjogc3RyaW5nLCBfb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVmb3JlSW5zdGFsbChfaW5wdXREaXI6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbYGNwIC1SICR7am9pbihfX2Rpcm5hbWUsICcuLicsICdsYW1iZGEtZm5zJywgJ3ByaXNtYScpfSAke291dHB1dERpcn0vYF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFmdGVyQnVuZGxpbmcoX2lucHV0RGlyOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICBgY2QgJHtvdXRwdXREaXJ9YCxcbiAgICAgICAgICAgICAgYHlhcm4gcHJpc21hIGdlbmVyYXRlYCxcbiAgICAgICAgICAgICAgYHJtIC1yZiBub2RlX21vZHVsZXMvQHByaXNtYS9lbmdpbmVzYCxcbiAgICAgICAgICAgICAgYHJtIC1yZiBub2RlX21vZHVsZXMvQHByaXNtYS9jbGllbnQvbm9kZV9tb2R1bGVzIG5vZGVfbW9kdWxlcy8uYmluIG5vZGVfbW9kdWxlcy9wcmlzbWFgLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICBjbHVzdGVyLmdyYW50RGF0YUFwaUFjY2VzcyhkYlNldHVwRm4pXG5cbiAgICBjb25zdCBkYlNldHVwQ3VzdG9tUmVzb3VyY2VQcm92aWRlciA9IG5ldyBjci5Qcm92aWRlcih0aGlzLCAnZGJTZXR1cEN1c3RvbVJlc291cmNlUHJvdmlkZXInLCB7XG4gICAgICBvbkV2ZW50SGFuZGxlcjogZGJTZXR1cEZuXG4gICAgfSlcblxuICAgIG5ldyBjZGsuQ3VzdG9tUmVzb3VyY2UodGhpcywgJ3NldHVwQ3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46IGRiU2V0dXBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLnNlcnZpY2VUb2tlblxuICAgIH0pXG5cblxuICAgIC8vIFJlc29sdmVyc1xuXG4gICAgY29uc3QgcmVzb2x2ZXJzID0gW1xuICAgICAgeyB0eXBlTmFtZTogJ1F1ZXJ5JywgZmllbGROYW1lOiAndXNlcicgfSxcbiAgICAgIHsgdHlwZU5hbWU6ICdRdWVyeScsIGZpZWxkTmFtZTogJ2NhbmRpZGF0ZXMnIH0sXG4gICAgICB7IHR5cGVOYW1lOiAnUXVlcnknLCBmaWVsZE5hbWU6ICdtYXRjaGVzJyB9LFxuICAgICAgeyB0eXBlTmFtZTogJ011dGF0aW9uJywgZmllbGROYW1lOiAnY3JlYXRlVXNlcicgfSxcbiAgICAgIHsgdHlwZU5hbWU6ICdNdXRhdGlvbicsIGZpZWxkTmFtZTogJ3VwZGF0ZVVzZXInIH0sXG4gICAgICB7IHR5cGVOYW1lOiAnTXV0YXRpb24nLCBmaWVsZE5hbWU6ICdsaWtlVXNlcicgfSxcbiAgICAgIHsgdHlwZU5hbWU6ICdNdXRhdGlvbicsIGZpZWxkTmFtZTogJ2Rpc2xpa2VVc2VyJyB9XG4gICAgXVxuXG4gICAgZm9yICggbGV0IHsgdHlwZU5hbWUsIGZpZWxkTmFtZSB9IG9mIHJlc29sdmVycykge1xuICAgICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoeyB0eXBlTmFtZSwgZmllbGROYW1lIH0pXG4gICAgfVxuICB9XG59XG4iXX0=