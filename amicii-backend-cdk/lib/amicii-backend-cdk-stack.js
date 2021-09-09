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
        const api = new appsync.GraphqlApi(this, 'Amicii Api', {
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
        const vpc = new ec2.Vpc(this, 'Amicii VPC', {
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
        const userFn = new ln.NodejsFunction(this, 'UserFunction', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFvQztBQUNwQyxnREFBK0M7QUFDL0Msd0NBQXVDO0FBQ3ZDLHdDQUF1QztBQUN2QyxpREFBZ0Q7QUFDaEQsOENBQTZDO0FBQzdDLGdEQUErQztBQUMvQyx3Q0FBdUM7QUFDdkMsZ0RBQStDO0FBQy9DLCtCQUEyQjtBQUUzQixNQUFNLFVBQVUsR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbEUsTUFBTSxXQUFXLEdBQUcsV0FBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFBO0FBQ3hFLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFFdkIsOEJBQThCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUM5QyxJQUFJLEVBQ0osMkJBQTJCLEVBQzNCLHFCQUFxQixDQUN0QixDQUFBO1FBRUQsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFFaEUscUJBQXFCO1FBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3JELElBQUksRUFBRSx3QkFBd0I7WUFDOUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1lBQzFELG1CQUFtQixF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U0FBaUIsRUFBRSxVQUFrQjt3QkFDbEQsT0FBTyxFQUFFLENBQUE7b0JBQ1gsQ0FBQztvQkFDRCxhQUFhLENBQUMsU0FBaUIsRUFBRSxTQUFpQjt3QkFDaEQsT0FBTzs0QkFDTCxTQUFTLFdBQUksQ0FDWCxTQUFTLEVBQ1QsSUFBSSxFQUNKLFlBQVksRUFDWixRQUFRLENBQ1QsSUFBSSxTQUFTLEdBQUc7eUJBQ2xCLENBQUE7b0JBQ0gsQ0FBQztvQkFDRCxhQUFhLENBQUMsU0FBaUIsRUFBRSxTQUFpQjt3QkFDaEQsT0FBTzs0QkFDTCxNQUFNLFNBQVMsRUFBRTs0QkFDakIsc0JBQXNCOzRCQUN0QixxQ0FBcUM7NEJBQ3JDLHVGQUF1Rjt5QkFDeEYsQ0FBQTtvQkFDSCxDQUFDO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUE7UUFFRixPQUFPLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFckMsTUFBTSw2QkFBNkIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQ25ELElBQUksRUFDSiwrQkFBK0IsRUFDL0I7WUFDRSxjQUFjLEVBQUUsU0FBUztTQUMxQixDQUNGLENBQUE7UUFFRCxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ2xELFlBQVksRUFBRSw2QkFBNkIsQ0FBQyxZQUFZO1NBQ3pELENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQW5QRCxzREFtUEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSdcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMnXG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMidcbmltcG9ydCAqIGFzIHJkcyBmcm9tICdAYXdzLWNkay9hd3MtcmRzJ1xuaW1wb3J0ICogYXMgbG4gZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYS1ub2RlanMnXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSdcbmltcG9ydCAqIGFzIGNvZ25pdG8gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZ25pdG8nXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSdcbmltcG9ydCAqIGFzIGNyIGZyb20gJ0Bhd3MtY2RrL2N1c3RvbS1yZXNvdXJjZXMnXG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCdcblxuY29uc3QgdXNlckZuUGF0aCA9IGpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLWZucycsICdpbmRleC50cycpXG5jb25zdCBzZXR1cEZuUGF0aCA9IGpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLWZucycsICdkYkZ1bmN0aW9uLnRzJylcbmV4cG9ydCBjbGFzcyBBbWljaWlCYWNrZW5kQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpXG5cbiAgICAvL0ltcG9ydCB1c2VycG9vbCBmcm9uIEFtcGxpZnlcbiAgICBjb25zdCB1c2VyUG9vbCA9IGNvZ25pdG8uVXNlclBvb2wuZnJvbVVzZXJQb29sSWQoXG4gICAgICB0aGlzLFxuICAgICAgJ2FtaWNpaS1hbW1wbGlmeS11c2VyLXBvb2wnLFxuICAgICAgJ2V1LXdlc3QtMl80WGtXMTlibXYnXG4gICAgKVxuXG4gICAgbmV3IGNvZ25pdG8uVXNlclBvb2xDbGllbnQodGhpcywgJ1VzZXJQb29sQ2xpZW50JywgeyB1c2VyUG9vbCB9KVxuXG4gICAgLy8gQ3JlYXRlIEdyYXBocWwgQXBpXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCAnQW1pY2lpIEFwaScsIHtcbiAgICAgIG5hbWU6ICdjZGstYW1pY2lpLWFwcHN5bmMtYXBpJyxcbiAgICAgIHNjaGVtYTogYXBwc3luYy5TY2hlbWEuZnJvbUFzc2V0KCdncmFwaHFsL3NjaGVtYS5ncmFwaHFsJyksXG4gICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuQVBJX0tFWSxcbiAgICAgICAgICBhcGlLZXlDb25maWc6IHtcbiAgICAgICAgICAgIGV4cGlyZXM6IGNkay5FeHBpcmF0aW9uLmFmdGVyKGNkay5EdXJhdGlvbi5kYXlzKDM2NSkpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wsXG4gICAgICAgICAgICB1c2VyUG9vbENvbmZpZzoge1xuICAgICAgICAgICAgICB1c2VyUG9vbCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdhd3NfYXBwc3luY2hfZ3JhcGhxbEVuZHBvaW50Jywge1xuICAgICAgdmFsdWU6IGFwaS5ncmFwaHFsVXJsLFxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXdzX2FwcHN5bmNoX3JlZ2lvbicsIHtcbiAgICAgIHZhbHVlOiAnZXUtd2VzdC0yJyxcbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9hdXRoZW50aWNhdGlvblR5cGUnLCB7XG4gICAgICB2YWx1ZTogJ0FQSV9LRVknLFxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnYXdzX2FwcHN5bmNoX2FwaWtleScsIHtcbiAgICAgIHZhbHVlOiBhcGkuYXBpS2V5IHx8ICcnLFxuICAgIH0pXG5cbiAgICAvL0NyZWF0ZSB0aGUgVlBDIGZvciB0aGUgU2VydmVybGVzc0RCIGNsdXN0ZXJcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnQW1pY2lpIFZQQycsIHtcbiAgICAgIGNpZHI6ICcxMC4wLjAuMC8yMCcsXG4gICAgICBuYXRHYXRld2F5czogMCxcbiAgICAgIG1heEF6czogMixcbiAgICAgIGVuYWJsZURuc0hvc3RuYW1lczogdHJ1ZSxcbiAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IHRydWUsXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjaWRyTWFzazogMjIsXG4gICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY2lkck1hc2s6IDIyLFxuICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSlcblxuICAgIGNvbnN0IHN1Ym5ldEdyb3VwID0gbmV3IHJkcy5TdWJuZXRHcm91cCh0aGlzLCAncmRzLXN1Ym5ldC1ncm91cCcsIHtcbiAgICAgIHZwYyxcbiAgICAgIHN1Ym5ldEdyb3VwTmFtZTogJ2F1cm9yYS1zdWJuZXQtZ3JvdXAnLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnUHJpdmF0ZSBzdWJuZXRzIGdyb3VwIGZvciB0aGUgREInLFxuICAgIH0pXG5cbiAgICBjb25zdCBwcml2YXRlU2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ3ByaXZhdGUtc2cnLCB7XG4gICAgICB2cGMsXG4gICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ3ByaXZhdGUtc2cnLFxuICAgIH0pXG5cbiAgICBwcml2YXRlU2cuYWRkSW5ncmVzc1J1bGUoXG4gICAgICBwcml2YXRlU2csXG4gICAgICBlYzIuUG9ydC5hbGxUcmFmZmljKCksXG4gICAgICAnYWxsb3cgaW50ZXJuYWwgU0cgYWNjZXNzJ1xuICAgIClcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgcmRzLlNlcnZlcmxlc3NDbHVzdGVyKHRoaXMsICdBdXJvcmFBbWljaWlDbHVzdGVyJywge1xuICAgICAgZW5naW5lOiByZHMuRGF0YWJhc2VDbHVzdGVyRW5naW5lLkFVUk9SQV9NWVNRTCxcbiAgICAgIHBhcmFtZXRlckdyb3VwOiByZHMuUGFyYW1ldGVyR3JvdXAuZnJvbVBhcmFtZXRlckdyb3VwTmFtZShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgJ1BhcmFtZXRlckdyb3VwJyxcbiAgICAgICAgJ2RlZmF1bHQuYXVyb3JhLW15c3FsNS43J1xuICAgICAgKSxcbiAgICAgIGRlZmF1bHREYXRhYmFzZU5hbWU6ICdBbWljaWlEQicsXG4gICAgICBlbmFibGVEYXRhQXBpOiB0cnVlLFxuICAgICAgdnBjOiB2cGMsXG4gICAgICBzdWJuZXRHcm91cCxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJpdmF0ZVNnXSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBzY2FsaW5nOiB7IGF1dG9QYXVzZTogY2RrLkR1cmF0aW9uLnNlY29uZHMoMCkgfSxcbiAgICB9KVxuXG4gICAgY29uc3QgdXNlckZuID0gbmV3IGxuLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdVc2VyRnVuY3Rpb24nLCB7XG4gICAgICB2cGMsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGVudHJ5OiB1c2VyRm5QYXRoLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgICAgbWVtb3J5U2l6ZTogMTAyNCxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIFNFQ1JFVF9BUk46IGNsdXN0ZXIuc2VjcmV0Py5zZWNyZXRBcm4gfHwgJycsXG4gICAgICAgIEFXU19OT0RFSlNfQ09OTkVDVElPTl9SRVVTRV9FTkFCTEVEOiAnMScsXG4gICAgICB9LFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgbm9kZU1vZHVsZXM6IFsnQHByaXNtYS9jbGllbnQnLCAncHJpc21hJ10sXG4gICAgICAgIGNvbW1hbmRIb29rczoge1xuICAgICAgICAgIGJlZm9yZUJ1bmRsaW5nKF9pbnB1dERpcjogc3RyaW5nLCBfb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVmb3JlSW5zdGFsbChfaW5wdXREaXI6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIGBjcCAtUiAke2pvaW4oXG4gICAgICAgICAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICAgICAgICAgICcuLicsXG4gICAgICAgICAgICAgICAgJ2xhbWJkYS1mbnMnLFxuICAgICAgICAgICAgICAgICdwcmlzbWEnXG4gICAgICAgICAgICAgICl9ICR7b3V0cHV0RGlyfS9gLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWZ0ZXJCdW5kbGluZyhfaW5wdXREaXI6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIGBjZCAke291dHB1dERpcn1gLFxuICAgICAgICAgICAgICBgeWFybiBwcmlzbWEgZ2VuZXJhdGVgLFxuICAgICAgICAgICAgICBgcm0gLXJmIG5vZGVfbW9kdWxlcy9AcHJpc21hL2VuZ2luZXNgLFxuICAgICAgICAgICAgICBgcm0gLXJmIG5vZGVfbW9kdWxlcy9AcHJpc21hL2NsaWVudC9ub2RlX21vZHVsZXMgbm9kZV9tb2R1bGVzLy5iaW4gbm9kZV9tb2R1bGVzL3ByaXNtYWAsXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIFNldCB1cCBncmFwaHFsIGRhdGEgc291cmNlXG5cbiAgICBjb25zdCBsYW1iZGFEcyA9IGFwaS5hZGRMYW1iZGFEYXRhU291cmNlKCdsYW1iZGFEYXRhU291cmNlJywgdXNlckZuKVxuXG4gICAgLy8gU2V0IHVwIGdyYXBocWwgcmVzb2x2ZXJzXG5cbiAgICBjb25zdCByZXNvbHZlcnMgPSBbXG4gICAgICB7IHR5cGVOYW1lOiAnUXVlcnknLCBmaWVsZE5hbWU6ICd1c2VyJyB9LFxuICAgICAgeyB0eXBlTmFtZTogJ1F1ZXJ5JywgZmllbGROYW1lOiAnY2FuZGlkYXRlcycgfSxcbiAgICAgIHsgdHlwZU5hbWU6ICdRdWVyeScsIGZpZWxkTmFtZTogJ21hdGNoZXMnIH0sXG4gICAgICB7IHR5cGVOYW1lOiAnTXV0YXRpb24nLCBmaWVsZE5hbWU6ICdjcmVhdGVVc2VyJyB9LFxuICAgICAgeyB0eXBlTmFtZTogJ011dGF0aW9uJywgZmllbGROYW1lOiAndXBkYXRlVXNlcicgfSxcbiAgICAgIHsgdHlwZU5hbWU6ICdNdXRhdGlvbicsIGZpZWxkTmFtZTogJ2xpa2VVc2VyJyB9LFxuICAgICAgeyB0eXBlTmFtZTogJ011dGF0aW9uJywgZmllbGROYW1lOiAnZGlzbGlrZVVzZXInIH0sXG4gICAgXVxuXG4gICAgZm9yIChsZXQgeyB0eXBlTmFtZSwgZmllbGROYW1lIH0gb2YgcmVzb2x2ZXJzKSB7XG4gICAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7IHR5cGVOYW1lLCBmaWVsZE5hbWUgfSlcbiAgICB9XG5cbiAgICAvLyBHaXZlIGFjY2VzcyB0byBTZWNyZXQgTWFuYWdlclxuXG4gICAgdXNlckZuLmFkZFRvUm9sZVBvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJ10sXG4gICAgICAgIHJlc291cmNlczogW2NsdXN0ZXIuc2VjcmV0Py5zZWNyZXRBcm4gfHwgJyddLFxuICAgICAgfSlcbiAgICApXG5cbiAgICBuZXcgZWMyLkludGVyZmFjZVZwY0VuZHBvaW50KHRoaXMsICdzZWNyZXRzLW1hbmFnZXInLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgIHZwYyxcbiAgICAgIHByaXZhdGVEbnNFbmFibGVkOiB0cnVlLFxuICAgICAgc3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgIH0pXG5cbiAgICAvLyBTZXR1cCBkYXRhYmFzZVxuXG4gICAgY29uc3QgZGJTZXR1cEZuID0gbmV3IGxuLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICdEYlNldHVwRnVuY3Rpb24nLCB7XG4gICAgICB2cGMsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdoYW5kbGVyJyxcbiAgICAgIGVudHJ5OiBzZXR1cEZuUGF0aCxcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDEwKSxcbiAgICAgIG1lbW9yeVNpemU6IDEwMjQsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBTRUNSRVRfQVJOOiBjbHVzdGVyLnNlY3JldD8uc2VjcmV0QXJuIHx8ICcnLFxuICAgICAgICBBV1NfTk9ERUpTX0NPTk5FQ1RJT05fUkVVU0VfRU5BQkxFRDogJzEnLFxuICAgICAgfSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIG5vZGVNb2R1bGVzOiBbJ0BwcmlzbWEvY2xpZW50JywgJ3ByaXNtYSddLFxuICAgICAgICBjb21tYW5kSG9va3M6IHtcbiAgICAgICAgICBiZWZvcmVCdW5kbGluZyhfaW5wdXREaXI6IHN0cmluZywgX291dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW11cbiAgICAgICAgICB9LFxuICAgICAgICAgIGJlZm9yZUluc3RhbGwoX2lucHV0RGlyOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICBgY3AgLVIgJHtqb2luKFxuICAgICAgICAgICAgICAgIF9fZGlybmFtZSxcbiAgICAgICAgICAgICAgICAnLi4nLFxuICAgICAgICAgICAgICAgICdsYW1iZGEtZm5zJyxcbiAgICAgICAgICAgICAgICAncHJpc21hJ1xuICAgICAgICAgICAgICApfSAke291dHB1dERpcn0vYCxcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGFmdGVyQnVuZGxpbmcoX2lucHV0RGlyOiBzdHJpbmcsIG91dHB1dERpcjogc3RyaW5nKSB7XG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICBgY2QgJHtvdXRwdXREaXJ9YCxcbiAgICAgICAgICAgICAgYHlhcm4gcHJpc21hIGdlbmVyYXRlYCxcbiAgICAgICAgICAgICAgYHJtIC1yZiBub2RlX21vZHVsZXMvQHByaXNtYS9lbmdpbmVzYCxcbiAgICAgICAgICAgICAgYHJtIC1yZiBub2RlX21vZHVsZXMvQHByaXNtYS9jbGllbnQvbm9kZV9tb2R1bGVzIG5vZGVfbW9kdWxlcy8uYmluIG5vZGVfbW9kdWxlcy9wcmlzbWFgLFxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICBjbHVzdGVyLmdyYW50RGF0YUFwaUFjY2VzcyhkYlNldHVwRm4pXG5cbiAgICBjb25zdCBkYlNldHVwQ3VzdG9tUmVzb3VyY2VQcm92aWRlciA9IG5ldyBjci5Qcm92aWRlcihcbiAgICAgIHRoaXMsXG4gICAgICAnZGJTZXR1cEN1c3RvbVJlc291cmNlUHJvdmlkZXInLFxuICAgICAge1xuICAgICAgICBvbkV2ZW50SGFuZGxlcjogZGJTZXR1cEZuLFxuICAgICAgfVxuICAgIClcblxuICAgIG5ldyBjZGsuQ3VzdG9tUmVzb3VyY2UodGhpcywgJ3NldHVwQ3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46IGRiU2V0dXBDdXN0b21SZXNvdXJjZVByb3ZpZGVyLnNlcnZpY2VUb2tlbixcbiAgICB9KVxuICB9XG59XG4iXX0=