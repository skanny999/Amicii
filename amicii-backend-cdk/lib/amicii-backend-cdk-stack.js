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
        new cognito.UserPoolClient(this, 'UserPoolClient', { userPool });
        // Create Graphql Api
        const api = new appsync.GraphqlApi(this, 'AmiciiApi', {
            name: 'cdk-amicii-appsync-api',
            schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY,
                    apiKeyConfig: {
                        expires: cdk.Expiration.after(cdk.Duration.days(365)),
                    },
                },
                additionalAuthorizationModes: [
                    {
                        authorizationType: appsync.AuthorizationType.USER_POOL,
                        userPoolConfig: {
                            userPool,
                        },
                    },
                ],
            },
        });
        new cdk.CfnOutput(this, 'aws_appsynch_graphqlEndpoint', {
            value: api.graphqlUrl,
        });
        new cdk.CfnOutput(this, 'aws_appsynch_region', {
            value: 'eu-west-2',
        });
        new cdk.CfnOutput(this, 'aws_appsynch_authenticationType', {
            value: 'API_KEY',
        });
        new cdk.CfnOutput(this, 'aws_appsynch_apikey', {
            value: api.apiKey || '',
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
        const subnetGroup = new rds.SubnetGroup(this, 'rds-subnet-group', {
            vpc,
            subnetGroupName: 'aurora-subnet-group',
            vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            description: 'Private subnets group for the DB',
        });
        const privateSg = new ec2.SecurityGroup(this, 'private-sg', {
            vpc,
            securityGroupName: 'private-sg',
        });
        privateSg.addIngressRule(privateSg, ec2.Port.allTraffic(), 'allow internal SG access');
        const cluster = new rds.ServerlessCluster(this, 'AuroraAmiciiCluster', {
            engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
            parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-mysql5.7'),
            defaultDatabaseName: 'AmiciiDB',
            enableDataApi: true,
            vpc: vpc,
            subnetGroup,
            securityGroups: [privateSg],
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            scaling: { autoPause: cdk.Duration.seconds(0) },
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
                        return [
                            `cp -R ${path_1.join(__dirname, '..', 'lambda-fns', 'prisma')} ${outputDir}/`,
                        ];
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
        // Set up graphql data source
        const lambdaDs = api.addLambdaDataSource('lambdaDataSource', userFn);
        // Set up graphql resolvers
        const resolvers = [
            { typeName: 'Query', fieldName: 'user' },
            { typeName: 'Query', fieldName: 'candidates' },
            { typeName: 'Query', fieldName: 'matches' },
            { typeName: 'Mutation', fieldName: 'createUser' },
            { typeName: 'Mutation', fieldName: 'updateUser' },
            { typeName: 'Mutation', fieldName: 'likeUser' },
            { typeName: 'Mutation', fieldName: 'dislikeUser' },
        ];
        for (let { typeName, fieldName } of resolvers) {
            lambdaDs.createResolver({ typeName, fieldName });
        }
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
                        return [
                            `cp -R ${path_1.join(__dirname, '..', 'lambda-fns', 'prisma')} ${outputDir}/`,
                        ];
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
            onEventHandler: dbSetupFn,
        });
        new cdk.CustomResource(this, 'setupCustomResource', {
            serviceToken: dbSetupCustomResourceProvider.serviceToken,
        });
    }
}
exports.AmiciiBackendCdkStack = AmiciiBackendCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFvQztBQUNwQyxnREFBK0M7QUFDL0Msd0NBQXVDO0FBQ3ZDLHdDQUF1QztBQUN2QyxpREFBZ0Q7QUFDaEQsOENBQTZDO0FBQzdDLGdEQUErQztBQUMvQyx3Q0FBdUM7QUFDdkMsZ0RBQStDO0FBQy9DLCtCQUEyQjtBQUUzQixNQUFNLFVBQVUsR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbEUsTUFBTSxXQUFXLEdBQUcsV0FBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFBO0FBQ3hFLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFdkIsOEJBQThCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUM5QyxJQUFJLEVBQ0osMkJBQTJCLEVBQzNCLHFCQUFxQixDQUN0QixDQUFBO1FBRUQsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFFaEUscUJBQXFCO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3BELElBQUksRUFBRSx3QkFBd0I7WUFDOUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1lBQzFELG1CQUFtQixF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U0FBaUIsRUFBRSxVQUFrQjt3QkFDbEQsT0FBTyxFQUFFLENBQUE7b0JBQ1gsQ0FBQztvQkFDRCxhQUFhLENBQUMsU0FBaUIsRUFBRSxTQUFpQjt3QkFDaEQsT0FBTzs0QkFDTCxTQUFTLFdBQUksQ0FDWCxTQUFTLEVBQ1QsSUFBSSxFQUNKLFlBQVksRUFDWixRQUFRLENBQ1QsSUFBSSxTQUFTLEdBQUc7eUJBQ2xCLENBQUE7b0JBQ0gsQ0FBQztvQkFDRCxhQUFhLENBQUMsU0FBaUIsRUFBRSxTQUFpQjt3QkFDaEQsT0FBTzs0QkFDTCxNQUFNLFNBQVMsRUFBRTs0QkFDakIsc0JBQXNCOzRCQUN0QixxQ0FBcUM7NEJBQ3JDLHVGQUF1Rjt5QkFDeEYsQ0FBQTtvQkFDSCxDQUFDO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUE7UUFFRixPQUFPLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFckMsTUFBTSw2QkFBNkIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQ25ELElBQUksRUFDSiwrQkFBK0IsRUFDL0I7WUFDRSxjQUFjLEVBQUUsU0FBUztTQUMxQixDQUNGLENBQUE7UUFFRCxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ2xELFlBQVksRUFBRSw2QkFBNkIsQ0FBQyxZQUFZO1NBQ3pELENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQWxQRCxzREFrUEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSdcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMnXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMidcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdAYXdzLWNkay9hd3MtcmRzJ1xuaW1wb3J0ICogYXMgbG4gZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYS1ub2RlanMnXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSdcbmltcG9ydCAqIGFzIGNvZ25pdG8gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZ25pdG8nXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSdcbmltcG9ydCAqIGFzIGNyIGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMnXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuY29uc3QgdXNlckZuUGF0aCA9IGpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLWZucycsICdpbmRleC50cycpXG5jb25zdCBzZXR1cEZuUGF0aCA9IGpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLWZucycsICdkYkZ1bmN0aW9uLnRzJylcbmV4cG9ydCBjbGFzcyBBbWljaWlCYWNrZW5kQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpXG5cbiAgICAvL0ltcG9ydCB1c2VycG9vbCBmcm9uIEFtcGxpZnlcbiAgICBjb25zdCB1c2VyUG9vbCA9IGNvZ25pdG8uVXNlclBvb2wuZnJvbVVzZXJQb29sSWQoXG4gICAgICB0aGlzLFxuICAgICAgJ2FtaWNpaS1hbW1wbGlmeS11c2VyLXBvb2wnLFxuICAgICAgJ2V1LXdlc3QtMl80WGtXMTlibXYnXG4gICAgKVxuXG4gICAgbmV3IGNvZ25pdG8uVXNlclBvb2xDbGllbnQodGhpcywgJ1VzZXJQb29sQ2xpZW50JywgeyB1c2VyUG9vbCB9KVxuXG4gICAgLy8gQ3JlYXRlIEdyYXBocWwgQXBpXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCAnQW1pY2lpQXBpJywge1xuICAgICAgbmFtZTogJ2Nkay1hbWljaWktYXBwc3luYy1hcGknLFxuICAgICAgc2NoZW1hOiBhcHBzeW5jLlNjaGVtYS5mcm9tQXNzZXQoJ2dyYXBocWwvc2NoZW1hLmdyYXBocWwnKSxcbiAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcbiAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZLFxuICAgICAgICAgIGFwaUtleUNvbmZpZzoge1xuICAgICAgICAgICAgZXhwaXJlczogY2RrLkV4cGlyYXRpb24uYWZ0ZXIoY2RrLkR1cmF0aW9uLmRheXMoMzY1KSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCxcbiAgICAgICAgICAgIHVzZXJQb29sQ29uZmlnOiB7XG4gICAgICAgICAgICAgIHVzZXJQb29sLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9ncmFwaHFsRW5kcG9pbnQnLCB7XG4gICAgICB2YWx1ZTogYXBpLmdyYXBocWxVcmwsXG4gICAgfSlcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdhd3NfYXBwc3luY2hfcmVnaW9uJywge1xuICAgICAgdmFsdWU6ICdldS13ZXN0LTInLFxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXdzX2FwcHN5bmNoX2F1dGhlbnRpY2F0aW9uVHlwZScsIHtcbiAgICAgIHZhbHVlOiAnQVBJX0tFWScsXG4gICAgfSlcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdhd3NfYXBwc3luY2hfYXBpa2V5Jywge1xuICAgICAgdmFsdWU6IGFwaS5hcGlLZXkgfHwgJycsXG4gICAgfSlcblxuICAgIC8vQ3JlYXRlIHRoZSBWUEMgZm9yIHRoZSBTZXJ2ZXJsZXNzREIgY2x1c3RlclxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdBbWljaWlWUEMnLCB7XG4gICAgICBjaWRyOiAnMTAuMC4wLjAvMjAnLFxuICAgICAgbmF0R2F0ZXdheXM6IDAsXG4gICAgICBtYXhBenM6IDIsXG4gICAgICBlbmFibGVEbnNIb3N0bmFtZXM6IHRydWUsXG4gICAgICBlbmFibGVEbnNTdXBwb3J0OiB0cnVlLFxuICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgY2lkck1hc2s6IDIyLFxuICAgICAgICAgIG5hbWU6ICdwdWJsaWMnLFxuICAgICAgICAgIHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGNpZHJNYXNrOiAyMixcbiAgICAgICAgICBuYW1lOiAncHJpdmF0ZScsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pXG5cbiAgICBjb25zdCBzdWJuZXRHcm91cCA9IG5ldyByZHMuU3VibmV0R3JvdXAodGhpcywgJ3Jkcy1zdWJuZXQtZ3JvdXAnLCB7XG4gICAgICB2cGMsXG4gICAgICBzdWJuZXRHcm91cE5hbWU6ICdhdXJvcmEtc3VibmV0LWdyb3VwJyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBkZXNjcmlwdGlvbjogJ1ByaXZhdGUgc3VibmV0cyBncm91cCBmb3IgdGhlIERCJyxcbiAgICB9KVxuXG4gICAgY29uc3QgcHJpdmF0ZVNnID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdwcml2YXRlLXNnJywge1xuICAgICAgdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdwcml2YXRlLXNnJyxcbiAgICB9KVxuICAgIHByaXZhdGVTZy5hZGRJbmdyZXNzUnVsZShcbiAgICAgIHByaXZhdGVTZyxcbiAgICAgIGVjMi5Qb3J0LmFsbFRyYWZmaWMoKSxcbiAgICAgICdhbGxvdyBpbnRlcm5hbCBTRyBhY2Nlc3MnXG4gICAgKVxuXG4gICAgY29uc3QgY2x1c3RlciA9IG5ldyByZHMuU2VydmVybGVzc0NsdXN0ZXIodGhpcywgJ0F1cm9yYUFtaWNpaUNsdXN0ZXInLCB7XG4gICAgICBlbmdpbmU6IHJkcy5EYXRhYmFzZUNsdXN0ZXJFbmdpbmUuQVVST1JBX01ZU1FMLFxuICAgICAgcGFyYW1ldGVyR3JvdXA6IHJkcy5QYXJhbWV0ZXJHcm91cC5mcm9tUGFyYW1ldGVyR3JvdXBOYW1lKFxuICAgICAgICB0aGlzLFxuICAgICAgICAnUGFyYW1ldGVyR3JvdXAnLFxuICAgICAgICAnZGVmYXVsdC5hdXJvcmEtbXlzcWw1LjcnXG4gICAgICApLFxuICAgICAgZGVmYXVsdERhdGFiYXNlTmFtZTogJ0FtaWNpaURCJyxcbiAgICAgIGVuYWJsZURhdGFBcGk6IHRydWUsXG4gICAgICB2cGM6IHZwYyxcbiAgICAgIHN1Ym5ldEdyb3VwLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIHNjYWxpbmc6IHsgYXV0b1BhdXNlOiBjZGsuRHVyYXRpb24uc2Vjb25kcygwKSB9LFxuICAgIH0pXG5cbiAgICBjb25zdCB1c2VyRm4gPSBuZXcgbG4uTm9kZWpzRnVuY3Rpb24odGhpcywgJ1VzZXJGbicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJpdmF0ZVNnXSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgZW50cnk6IHVzZXJGblBhdGgsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgU0VDUkVUX0FSTjogY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJyxcbiAgICAgICAgQVdTX05PREVKU19DT05ORUNUSU9OX1JFVVNFX0VOQUJMRUQ6ICcxJyxcbiAgICAgIH0sXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBub2RlTW9kdWxlczogWydAcHJpc21hL2NsaWVudCcsICdwcmlzbWEnXSxcbiAgICAgICAgY29tbWFuZEhvb2tzOiB7XG4gICAgICAgICAgYmVmb3JlQnVuZGxpbmcoX2lucHV0RGlyOiBzdHJpbmcsIF9vdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBiZWZvcmVJbnN0YWxsKF9pbnB1dERpcjogc3RyaW5nLCBvdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgYGNwIC1SICR7am9pbihcbiAgICAgICAgICAgICAgICBfX2Rpcm5hbWUsXG4gICAgICAgICAgICAgICAgJy4uJyxcbiAgICAgICAgICAgICAgICAnbGFtYmRhLWZucycsXG4gICAgICAgICAgICAgICAgJ3ByaXNtYSdcbiAgICAgICAgICAgICAgKX0gJHtvdXRwdXREaXJ9L2AsXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBhZnRlckJ1bmRsaW5nKF9pbnB1dERpcjogc3RyaW5nLCBvdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgYGNkICR7b3V0cHV0RGlyfWAsXG4gICAgICAgICAgICAgIGB5YXJuIHByaXNtYSBnZW5lcmF0ZWAsXG4gICAgICAgICAgICAgIGBybSAtcmYgbm9kZV9tb2R1bGVzL0BwcmlzbWEvZW5naW5lc2AsXG4gICAgICAgICAgICAgIGBybSAtcmYgbm9kZV9tb2R1bGVzL0BwcmlzbWEvY2xpZW50L25vZGVfbW9kdWxlcyBub2RlX21vZHVsZXMvLmJpbiBub2RlX21vZHVsZXMvcHJpc21hYCxcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgLy8gU2V0IHVwIGdyYXBocWwgZGF0YSBzb3VyY2VcblxuICAgIGNvbnN0IGxhbWJkYURzID0gYXBpLmFkZExhbWJkYURhdGFTb3VyY2UoJ2xhbWJkYURhdGFTb3VyY2UnLCB1c2VyRm4pXG5cbiAgICAvLyBTZXQgdXAgZ3JhcGhxbCByZXNvbHZlcnNcblxuICAgIGNvbnN0IHJlc29sdmVycyA9IFtcbiAgICAgIHsgdHlwZU5hbWU6ICdRdWVyeScsIGZpZWxkTmFtZTogJ3VzZXInIH0sXG4gICAgICB7IHR5cGVOYW1lOiAnUXVlcnknLCBmaWVsZE5hbWU6ICdjYW5kaWRhdGVzJyB9LFxuICAgICAgeyB0eXBlTmFtZTogJ1F1ZXJ5JywgZmllbGROYW1lOiAnbWF0Y2hlcycgfSxcbiAgICAgIHsgdHlwZU5hbWU6ICdNdXRhdGlvbicsIGZpZWxkTmFtZTogJ2NyZWF0ZVVzZXInIH0sXG4gICAgICB7IHR5cGVOYW1lOiAnTXV0YXRpb24nLCBmaWVsZE5hbWU6ICd1cGRhdGVVc2VyJyB9LFxuICAgICAgeyB0eXBlTmFtZTogJ011dGF0aW9uJywgZmllbGROYW1lOiAnbGlrZVVzZXInIH0sXG4gICAgICB7IHR5cGVOYW1lOiAnTXV0YXRpb24nLCBmaWVsZE5hbWU6ICdkaXNsaWtlVXNlcicgfSxcbiAgICBdXG5cbiAgICBmb3IgKGxldCB7IHR5cGVOYW1lLCBmaWVsZE5hbWUgfSBvZiByZXNvbHZlcnMpIHtcbiAgICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHsgdHlwZU5hbWUsIGZpZWxkTmFtZSB9KVxuICAgIH1cblxuICAgIC8vIEdpdmUgYWNjZXNzIHRvIFNlY3JldCBNYW5hZ2VyXG5cbiAgICB1c2VyRm4uYWRkVG9Sb2xlUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJ10sXG4gICAgICB9KVxuICAgIClcblxuICAgIG5ldyBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnQodGhpcywgJ3NlY3JldHMtbWFuYWdlcicsIHtcbiAgICAgIHNlcnZpY2U6IGVjMi5JbnRlcmZhY2VWcGNFbmRwb2ludEF3c1NlcnZpY2UuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgdnBjLFxuICAgICAgcHJpdmF0ZURuc0VuYWJsZWQ6IHRydWUsXG4gICAgICBzdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgfSlcblxuICAgIC8vIFNldHVwIGRhdGFiYXNlXG5cbiAgICBjb25zdCBkYlNldHVwRm4gPSBuZXcgbG4uTm9kZWpzRnVuY3Rpb24odGhpcywgJ0RiU2V0dXBGdW5jdGlvbicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJpdmF0ZVNnXSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgZW50cnk6IHNldHVwRm5QYXRoLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFNFQ1JFVF9BUk46IGNsdXN0ZXIuc2VjcmV0Py5zZWNyZXRBcm4gfHwgJycsXG4gICAgICAgIEFXU19OT0RFSlNfQ09OTkVDVElPTl9SRVVTRV9FTkFCTEVEOiAnMScsXG4gICAgICB9LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgbm9kZU1vZHVsZXM6IFsnQHByaXNtYS9jbGllbnQnLCAncHJpc21hJ10sXG4gICAgICAgIGNvbW1hbmRIb29rczoge1xuICAgICAgICAgIGJlZm9yZUJ1bmRsaW5nKF9pbnB1dERpcjogc3RyaW5nLCBfb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVmb3JlSW5zdGFsbChfaW5wdXREaXI6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIGBjcCAtUiAke2pvaW4oXG4gICAgICAgICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgICAgICAgICcuLicsXG4gICAgICAgICAgICAgICAgJ2xhbWJkYS1mbnMnLFxuICAgICAgICAgICAgICAgICdwcmlzbWEnXG4gICAgICAgICAgICAgICl9ICR7b3V0cHV0RGlyfS9gLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWZ0ZXJCdW5kbGluZyhfaW5wdXREaXI6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIGBjZCAke291dHB1dERpcn1gLFxuICAgICAgICAgICAgICBgeWFybiBwcmlzbWEgZ2VuZXJhdGVgLFxuICAgICAgICAgICAgICBgcm0gLXJmIG5vZGVfbW9kdWxlcy9AcHJpc21hL2VuZ2luZXNgLFxuICAgICAgICAgICAgICBgcm0gLXJmIG5vZGVfbW9kdWxlcy9AcHJpc21hL2NsaWVudC9ub2RlX21vZHVsZXMgbm9kZV9tb2R1bGVzLy5iaW4gbm9kZV9tb2R1bGVzL3ByaXNtYWAsXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIGNsdXN0ZXIuZ3JhbnREYXRhQXBpQWNjZXNzKGRiU2V0dXBGbilcblxuICAgIGNvbnN0IGRiU2V0dXBDdXN0b21SZXNvdXJjZVByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKFxuICAgICAgdGhpcyxcbiAgICAgICdkYlNldHVwQ3VzdG9tUmVzb3VyY2VQcm92aWRlcicsXG4gICAgICB7XG4gICAgICAgIG9uRXZlbnRIYW5kbGVyOiBkYlNldHVwRm4sXG4gICAgICB9XG4gICAgKVxuXG4gICAgbmV3IGNkay5DdXN0b21SZXNvdXJjZSh0aGlzLCAnc2V0dXBDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogZGJTZXR1cEN1c3RvbVJlc291cmNlUHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgIH0pXG4gIH1cbn1cbiJdfQ==