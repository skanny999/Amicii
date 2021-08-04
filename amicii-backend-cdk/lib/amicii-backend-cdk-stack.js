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
        // const userFn1 = new lambda.Function(this, 'UserFunction', {
        //   vpc,
        //   vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
        //   securityGroups: [privateSg],
        //   runtime: lambda.Runtime.NODEJS_14_X,
        //   code: new lambda.AssetCode('lambda-fns'),
        //   handler: 'index.handler',
        //   memorySize: 1024,
        //   timeout: cdk.Duration.seconds(10),
        //   environment: {
        //     SECRET_ARN: cluster.secret?.secretArn || '',
        //     AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        //   },
        // })
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
        // const dbSetupFn1 = new lambda.Function(this, 'DbSetupFunction', {
        //   vpc,
        //   vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
        //   securityGroups: [privateSg],
        //   runtime: lambda.Runtime.NODEJS_14_X,
        //   code: new lambda.AssetCode('lambda-fns'),
        //   handler: 'dbFunction.handler',
        //   memorySize: 1024,
        //   timeout: cdk.Duration.seconds(10),
        //   environment: {
        //     SECRET_ARN: cluster.secret?.secretArn || '',
        //     AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
        //   },
        // })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW1pY2lpLWJhY2tlbmQtY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnREFBK0M7QUFDL0Msd0NBQXVDO0FBQ3ZDLHdDQUF1QztBQUN2QyxpREFBZ0Q7QUFDaEQsOENBQTZDO0FBQzdDLGdEQUErQztBQUMvQyx3Q0FBdUM7QUFDdkMsZ0RBQStDO0FBQy9DLCtCQUE0QjtBQUU1QixNQUFNLFVBQVUsR0FBRyxXQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7QUFDbEUsTUFBTSxXQUFXLEdBQUcsV0FBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFBO0FBQ3hFLE1BQWEscUJBQXNCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjs7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsOEJBQThCO1FBQzlCLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSwyQkFBMkIsRUFBRSxxQkFBcUIsQ0FBQyxDQUFBO1FBRTFHLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBR2hFLHFCQUFxQjtRQUNyQixNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNwRCxJQUFJLEVBQUUsd0JBQXdCO1lBQzlCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztZQUMxRCxtQkFBbUIsRUFBRTtnQkFDbkIsb0JBQW9CLEVBQUU7b0JBQ3BCLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPO29CQUNwRCxZQUFZLEVBQUU7d0JBQ1osT0FBTyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN0RDtpQkFDRjtnQkFDRCw0QkFBNEIsRUFBRSxDQUFDO3dCQUM3QixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsU0FBUzt3QkFDdEQsY0FBYyxFQUFFOzRCQUNkLFFBQVE7eUJBQ1Q7cUJBQ0YsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSw4QkFBOEIsRUFBRTtZQUN0RCxLQUFLLEVBQUUsR0FBRyxDQUFDLFVBQVU7U0FDdEIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUM3QyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sSUFBSSxFQUFFO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsaUNBQWlDLEVBQUU7WUFDekQsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQyxDQUFBO1FBR0YsNkNBQTZDO1FBQzdDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ3pDLElBQUksRUFBRSxhQUFhO1lBQ25CLFdBQVcsRUFBRSxDQUFDO1lBQ2QsTUFBTSxFQUFFLENBQUM7WUFDVCxrQkFBa0IsRUFBRSxJQUFJO1lBQ3hCLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRSxRQUFRO29CQUNkLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07aUJBQ2xDO2dCQUNEO29CQUNFLFFBQVEsRUFBRSxFQUFFO29CQUNaLElBQUksRUFBRSxTQUFTO29CQUNmLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVE7aUJBQ3BDO2FBQ0Y7U0FDRixDQUFDLENBQUE7UUFHRixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUMxRCxHQUFHO1lBQ0gsaUJBQWlCLEVBQUUsWUFBWTtTQUNoQyxDQUFDLENBQUE7UUFDRixTQUFTLENBQUMsY0FBYyxDQUN0QixTQUFTLEVBQ1QsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFDckIsMEJBQTBCLENBQzNCLENBQUE7UUFFRCxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ2hFLEdBQUc7WUFDSCxlQUFlLEVBQUUscUJBQXFCO1lBQ3RDLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNuRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO1lBQ3hDLFdBQVcsRUFBRSx5Q0FBeUM7U0FDdkQsQ0FBQyxDQUFBO1FBRUYsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ3JFLE1BQU0sRUFBRSxHQUFHLENBQUMscUJBQXFCLENBQUMsWUFBWTtZQUM5QyxjQUFjLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUseUJBQXlCLENBQUM7WUFDNUcsbUJBQW1CLEVBQUUsVUFBVTtZQUMvQixhQUFhLEVBQUUsSUFBSTtZQUNuQixHQUFHLEVBQUUsR0FBRztZQUNSLFdBQVc7WUFDWCxjQUFjLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDM0IsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxPQUFPLEVBQUUsRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDaEQsQ0FBQyxDQUFBO1FBRUYsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDbkQsR0FBRztZQUNILFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNuRCxjQUFjLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDM0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsU0FBUztZQUNsQixLQUFLLEVBQUUsVUFBVTtZQUNqQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2pDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsQ0FBQSxNQUFBLE9BQU8sQ0FBQyxNQUFNLDBDQUFFLFNBQVMsS0FBSSxFQUFFO2dCQUMzQyxtQ0FBbUMsRUFBRSxHQUFHO2FBQ3pDO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLFdBQVcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQztnQkFDekMsWUFBWSxFQUFFO29CQUNaLGNBQWMsQ0FBQyxTQUFpQixFQUFFLFVBQWtCO3dCQUNsRCxPQUFPLEVBQUUsQ0FBQTtvQkFDWCxDQUFDO29CQUNELGFBQWEsQ0FBQyxTQUFpQixFQUFFLFNBQWlCO3dCQUNoRCxPQUFPLENBQUMsU0FBUyxXQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtvQkFDakYsQ0FBQztvQkFDRCxhQUFhLENBQUMsU0FBaUIsRUFBRSxTQUFpQjt3QkFDaEQsT0FBTzs0QkFDTCxNQUFNLFNBQVMsRUFBRTs0QkFDakIsc0JBQXNCOzRCQUN0QixxQ0FBcUM7NEJBQ3JDLHVGQUF1Rjt5QkFDeEYsQ0FBQTtvQkFDSCxDQUFDO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUE7UUFFRiw4REFBOEQ7UUFDOUQsU0FBUztRQUNULHlEQUF5RDtRQUN6RCxpQ0FBaUM7UUFDakMseUNBQXlDO1FBQ3pDLDhDQUE4QztRQUM5Qyw4QkFBOEI7UUFDOUIsc0JBQXNCO1FBQ3RCLHVDQUF1QztRQUN2QyxtQkFBbUI7UUFDbkIsbURBQW1EO1FBQ25ELGdEQUFnRDtRQUNoRCxPQUFPO1FBQ1AsS0FBSztRQUVMLGdDQUFnQztRQUNoQyxNQUFNLENBQUMsZUFBZSxDQUNwQixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDdEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztZQUN4QixPQUFPLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztZQUMxQyxTQUFTLEVBQUUsQ0FBQyxDQUFBLE1BQUEsT0FBTyxDQUFDLE1BQU0sMENBQUUsU0FBUyxLQUFJLEVBQUUsQ0FBQztTQUM3QyxDQUFDLENBQ0gsQ0FBQTtRQUVELElBQUksR0FBRyxDQUFDLG9CQUFvQixDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNwRCxPQUFPLEVBQUUsR0FBRyxDQUFDLDhCQUE4QixDQUFDLGVBQWU7WUFDM0QsR0FBRztZQUNILGlCQUFpQixFQUFFLElBQUk7WUFDdkIsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFO1lBQ2hELGNBQWMsRUFBRSxDQUFDLFNBQVMsQ0FBQztTQUM1QixDQUFDLENBQUE7UUFFRixNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLENBQUE7UUFFcEUsaUJBQWlCO1FBRWpCLE1BQU0sU0FBUyxHQUFHLElBQUksRUFBRSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDL0QsR0FBRztZQUNILFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUNuRCxjQUFjLEVBQUUsQ0FBQyxTQUFTLENBQUM7WUFDM0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsU0FBUztZQUNsQixLQUFLLEVBQUUsV0FBVztZQUNsQixPQUFPLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ2pDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsQ0FBQSxNQUFBLE9BQU8sQ0FBQyxNQUFNLDBDQUFFLFNBQVMsS0FBSSxFQUFFO2dCQUMzQyxtQ0FBbUMsRUFBRSxHQUFHO2FBQ3pDO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLFdBQVcsRUFBRSxDQUFDLGdCQUFnQixFQUFFLFFBQVEsQ0FBQztnQkFDekMsWUFBWSxFQUFFO29CQUNaLGNBQWMsQ0FBQyxTQUFpQixFQUFFLFVBQWtCO3dCQUNsRCxPQUFPLEVBQUUsQ0FBQTtvQkFDWCxDQUFDO29CQUNELGFBQWEsQ0FBQyxTQUFpQixFQUFFLFNBQWlCO3dCQUNoRCxPQUFPLENBQUMsU0FBUyxXQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxDQUFDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQTtvQkFDakYsQ0FBQztvQkFDRCxhQUFhLENBQUMsU0FBaUIsRUFBRSxTQUFpQjt3QkFDaEQsT0FBTzs0QkFDTCxNQUFNLFNBQVMsRUFBRTs0QkFDakIsc0JBQXNCOzRCQUN0QixxQ0FBcUM7NEJBQ3JDLHVGQUF1Rjt5QkFDeEYsQ0FBQTtvQkFDSCxDQUFDO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUE7UUFFRixvRUFBb0U7UUFDcEUsU0FBUztRQUNULHlEQUF5RDtRQUN6RCxpQ0FBaUM7UUFDakMseUNBQXlDO1FBQ3pDLDhDQUE4QztRQUM5QyxtQ0FBbUM7UUFDbkMsc0JBQXNCO1FBQ3RCLHVDQUF1QztRQUN2QyxtQkFBbUI7UUFDbkIsbURBQW1EO1FBQ25ELGdEQUFnRDtRQUNoRCxPQUFPO1FBQ1AsS0FBSztRQUVMLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUVyQyxNQUFNLDZCQUE2QixHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsK0JBQStCLEVBQUU7WUFDM0YsY0FBYyxFQUFFLFNBQVM7U0FDMUIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxxQkFBcUIsRUFBRTtZQUNsRCxZQUFZLEVBQUUsNkJBQTZCLENBQUMsWUFBWTtTQUN6RCxDQUFDLENBQUE7UUFHRixZQUFZO1FBRVosUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUN0QixRQUFRLEVBQUUsT0FBTztZQUNqQixTQUFTLEVBQUUsZUFBZTtTQUMzQixDQUFDLENBQUE7UUFFRixRQUFRLENBQUMsY0FBYyxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLFNBQVMsRUFBRSxZQUFZO1NBQ3hCLENBQUMsQ0FBQTtRQUVGLFFBQVEsQ0FBQyxjQUFjLENBQUM7WUFDdEIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsU0FBUyxFQUFFLFlBQVk7U0FDeEIsQ0FBQyxDQUFBO1FBRUYsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUN0QixRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUF2UEQsc0RBdVBDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYydcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJ1xuaW1wb3J0ICogYXMgcmRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yZHMnXG5pbXBvcnQgKiBhcyBsbiBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhLW5vZGVqcydcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJ1xuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0bydcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJ1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnQGF3cy1jZGsvY3VzdG9tLXJlc291cmNlcydcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJztcblxuY29uc3QgdXNlckZuUGF0aCA9IGpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLWZucycsICdpbmRleC50cycpXG5jb25zdCBzZXR1cEZuUGF0aCA9IGpvaW4oX19kaXJuYW1lLCAnLi4nLCAnbGFtYmRhLWZucycsICdkYkZ1bmN0aW9uLnRzJylcbmV4cG9ydCBjbGFzcyBBbWljaWlCYWNrZW5kQ2RrU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy9JbXBvcnQgdXNlcnBvb2wgZnJvbiBBbXBsaWZ5XG4gICAgY29uc3QgdXNlclBvb2wgPSBjb2duaXRvLlVzZXJQb29sLmZyb21Vc2VyUG9vbElkKHRoaXMsICdhbWljaWktYW1tcGxpZnktdXNlci1wb29sJywgJ2V1LXdlc3QtMl80WGtXMTlibXYnKVxuXG4gICAgbmV3IGNvZ25pdG8uVXNlclBvb2xDbGllbnQodGhpcywgXCJVc2VyUG9vbENsaWVudFwiLCB7IHVzZXJQb29sIH0pXG5cblxuICAgIC8vIENyZWF0ZSBHcmFwaHFsIEFwaVxuICAgIGNvbnN0IGFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ0FtaWNpaUFwaScsIHtcbiAgICAgIG5hbWU6ICdjZGstYW1pY2lpLWFwcHN5bmMtYXBpJyxcbiAgICAgIHNjaGVtYTogYXBwc3luYy5TY2hlbWEuZnJvbUFzc2V0KCdncmFwaHFsL3NjaGVtYS5ncmFwaHFsJyksXG4gICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuQVBJX0tFWSxcbiAgICAgICAgICBhcGlLZXlDb25maWc6IHtcbiAgICAgICAgICAgIGV4cGlyZXM6IGNkay5FeHBpcmF0aW9uLmFmdGVyKGNkay5EdXJhdGlvbi5kYXlzKDM2NSkpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzOiBbe1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCxcbiAgICAgICAgICB1c2VyUG9vbENvbmZpZzoge1xuICAgICAgICAgICAgdXNlclBvb2xcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9XG4gICAgfSlcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdhd3NfYXBwc3luY2hfZ3JhcGhxbEVuZHBvaW50Jywge1xuICAgICAgdmFsdWU6IGFwaS5ncmFwaHFsVXJsXG4gICAgfSlcblxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdhd3NfYXBwc3luY2hfYXBpa2V5Jywge1xuICAgICAgdmFsdWU6IGFwaS5hcGlLZXkgfHwgJydcbiAgICB9KVxuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ2F3c19hcHBzeW5jaF9hdXRoZW50aWNhdGlvblR5cGUnLCB7XG4gICAgICB2YWx1ZTogJ0FQSV9LRVknXG4gICAgfSlcblxuXG4gICAgLy9DcmVhdGUgdGhlIFZQQyBmb3IgdGhlIFNlcnZlcmxlc3NEQiBjbHVzdGVyXG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGModGhpcywgJ0FtaWNpaVZQQycsIHtcbiAgICAgIGNpZHI6ICcxMC4wLjAuMC8yMCcsXG4gICAgICBuYXRHYXRld2F5czogMCxcbiAgICAgIG1heEF6czogMixcbiAgICAgIGVuYWJsZURuc0hvc3RuYW1lczogdHJ1ZSxcbiAgICAgIGVuYWJsZURuc1N1cHBvcnQ6IHRydWUsXG4gICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBjaWRyTWFzazogMjIsXG4gICAgICAgICAgbmFtZTogJ3B1YmxpYycsXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgY2lkck1hc2s6IDIyLFxuICAgICAgICAgIG5hbWU6ICdwcml2YXRlJyxcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSlcblxuXG4gICAgY29uc3QgcHJpdmF0ZVNnID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHRoaXMsICdwcml2YXRlLXNnJywge1xuICAgICAgdnBjLFxuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdwcml2YXRlLXNnJyxcbiAgICB9KVxuICAgIHByaXZhdGVTZy5hZGRJbmdyZXNzUnVsZShcbiAgICAgIHByaXZhdGVTZyxcbiAgICAgIGVjMi5Qb3J0LmFsbFRyYWZmaWMoKSxcbiAgICAgICdhbGxvdyBpbnRlcm5hbCBTRyBhY2Nlc3MnXG4gICAgKVxuXG4gICAgY29uc3Qgc3VibmV0R3JvdXAgPSBuZXcgcmRzLlN1Ym5ldEdyb3VwKHRoaXMsICdyZHMtc3VibmV0LWdyb3VwJywge1xuICAgICAgdnBjLFxuICAgICAgc3VibmV0R3JvdXBOYW1lOiAnYXVyb3JhLXN1Ym5ldC1ncm91cCcsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgZGVzY3JpcHRpb246ICdBbiBhbGwgcHJpdmF0ZSBzdWJuZXRzIGdyb3VwIGZvciB0aGUgREInLFxuICAgIH0pXG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IHJkcy5TZXJ2ZXJsZXNzQ2x1c3Rlcih0aGlzLCAnQXVyb3JhQW1pY2lpQ2x1c3RlcicsIHtcbiAgICAgIGVuZ2luZTogcmRzLkRhdGFiYXNlQ2x1c3RlckVuZ2luZS5BVVJPUkFfTVlTUUwsXG4gICAgICBwYXJhbWV0ZXJHcm91cDogcmRzLlBhcmFtZXRlckdyb3VwLmZyb21QYXJhbWV0ZXJHcm91cE5hbWUodGhpcywgJ1BhcmFtZXRlckdyb3VwJywgXCJkZWZhdWx0LmF1cm9yYS1teXNxbDUuN1wiKSxcbiAgICAgIGRlZmF1bHREYXRhYmFzZU5hbWU6ICdBbWljaWlEQicsXG4gICAgICBlbmFibGVEYXRhQXBpOiB0cnVlLFxuICAgICAgdnBjOiB2cGMsXG4gICAgICBzdWJuZXRHcm91cCxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJpdmF0ZVNnXSxcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBzY2FsaW5nOiB7IGF1dG9QYXVzZTogY2RrLkR1cmF0aW9uLnNlY29uZHMoMCkgfVxuICAgIH0pXG5cbiAgICBjb25zdCB1c2VyRm4gPSBuZXcgbG4uTm9kZWpzRnVuY3Rpb24odGhpcywgJ1VzZXJGbicsIHtcbiAgICAgIHZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuSVNPTEFURUQgfSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbcHJpdmF0ZVNnXSxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ2hhbmRsZXInLFxuICAgICAgZW50cnk6IHVzZXJGblBhdGgsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgU0VDUkVUX0FSTjogY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJyxcbiAgICAgICAgQVdTX05PREVKU19DT05ORUNUSU9OX1JFVVNFX0VOQUJMRUQ6ICcxJyxcbiAgICAgIH0sXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBub2RlTW9kdWxlczogWydAcHJpc21hL2NsaWVudCcsICdwcmlzbWEnXSxcbiAgICAgICAgY29tbWFuZEhvb2tzOiB7XG4gICAgICAgICAgYmVmb3JlQnVuZGxpbmcoX2lucHV0RGlyOiBzdHJpbmcsIF9vdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBiZWZvcmVJbnN0YWxsKF9pbnB1dERpcjogc3RyaW5nLCBvdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtgY3AgLVIgJHtqb2luKF9fZGlybmFtZSwgJy4uJywgJ2xhbWJkYS1mbnMnLCAncHJpc21hJyl9ICR7b3V0cHV0RGlyfS9gXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWZ0ZXJCdW5kbGluZyhfaW5wdXREaXI6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIGBjZCAke291dHB1dERpcn1gLFxuICAgICAgICAgICAgICBgeWFybiBwcmlzbWEgZ2VuZXJhdGVgLFxuICAgICAgICAgICAgICBgcm0gLXJmIG5vZGVfbW9kdWxlcy9AcHJpc21hL2VuZ2luZXNgLFxuICAgICAgICAgICAgICBgcm0gLXJmIG5vZGVfbW9kdWxlcy9AcHJpc21hL2NsaWVudC9ub2RlX21vZHVsZXMgbm9kZV9tb2R1bGVzLy5iaW4gbm9kZV9tb2R1bGVzL3ByaXNtYWAsXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIGNvbnN0IHVzZXJGbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdVc2VyRnVuY3Rpb24nLCB7XG4gICAgLy8gICB2cGMsXG4gICAgLy8gICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgLy8gICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgLy8gICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAvLyAgIGNvZGU6IG5ldyBsYW1iZGEuQXNzZXRDb2RlKCdsYW1iZGEtZm5zJyksXG4gICAgLy8gICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgLy8gICBtZW1vcnlTaXplOiAxMDI0LFxuICAgIC8vICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoMTApLFxuICAgIC8vICAgZW52aXJvbm1lbnQ6IHtcbiAgICAvLyAgICAgU0VDUkVUX0FSTjogY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJyxcbiAgICAvLyAgICAgQVdTX05PREVKU19DT05ORUNUSU9OX1JFVVNFX0VOQUJMRUQ6ICcxJyxcbiAgICAvLyAgIH0sXG4gICAgLy8gfSlcblxuICAgIC8vIEdpdmUgYWNjZXNzIHRvIFNlY3JldCBNYW5hZ2VyXG4gICAgdXNlckZuLmFkZFRvUm9sZVBvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBhY3Rpb25zOiBbJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJ10sXG4gICAgICAgIHJlc291cmNlczogW2NsdXN0ZXIuc2VjcmV0Py5zZWNyZXRBcm4gfHwgJyddLFxuICAgICAgfSlcbiAgICApXG5cbiAgICBuZXcgZWMyLkludGVyZmFjZVZwY0VuZHBvaW50KHRoaXMsICdzZWNyZXRzLW1hbmFnZXInLCB7XG4gICAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgIHZwYyxcbiAgICAgIHByaXZhdGVEbnNFbmFibGVkOiB0cnVlLFxuICAgICAgc3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgIH0pXG5cbiAgICBjb25zdCBsYW1iZGFEcyA9IGFwaS5hZGRMYW1iZGFEYXRhU291cmNlKCdsYW1iZGFEYXRhU291cmNlJywgdXNlckZuKVxuXG4gICAgLy8gU2V0dXAgZGF0YWJhc2VcblxuICAgIGNvbnN0IGRiU2V0dXBGbiA9IG5ldyBsbi5Ob2RlanNGdW5jdGlvbih0aGlzLCAnRGJTZXR1cEZ1bmN0aW9uJywge1xuICAgICAgdnBjLFxuICAgICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5JU09MQVRFRCB9LFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtwcml2YXRlU2ddLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaGFuZGxlcicsXG4gICAgICBlbnRyeTogc2V0dXBGblBhdGgsXG4gICAgICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgU0VDUkVUX0FSTjogY2x1c3Rlci5zZWNyZXQ/LnNlY3JldEFybiB8fCAnJyxcbiAgICAgICAgQVdTX05PREVKU19DT05ORUNUSU9OX1JFVVNFX0VOQUJMRUQ6ICcxJyxcbiAgICAgIH0sXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBub2RlTW9kdWxlczogWydAcHJpc21hL2NsaWVudCcsICdwcmlzbWEnXSxcbiAgICAgICAgY29tbWFuZEhvb2tzOiB7XG4gICAgICAgICAgYmVmb3JlQnVuZGxpbmcoX2lucHV0RGlyOiBzdHJpbmcsIF9vdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBiZWZvcmVJbnN0YWxsKF9pbnB1dERpcjogc3RyaW5nLCBvdXRwdXREaXI6IHN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIFtgY3AgLVIgJHtqb2luKF9fZGlybmFtZSwgJy4uJywgJ2xhbWJkYS1mbnMnLCAncHJpc21hJyl9ICR7b3V0cHV0RGlyfS9gXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYWZ0ZXJCdW5kbGluZyhfaW5wdXREaXI6IHN0cmluZywgb3V0cHV0RGlyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIGBjZCAke291dHB1dERpcn1gLFxuICAgICAgICAgICAgICBgeWFybiBwcmlzbWEgZ2VuZXJhdGVgLFxuICAgICAgICAgICAgICBgcm0gLXJmIG5vZGVfbW9kdWxlcy9AcHJpc21hL2VuZ2luZXNgLFxuICAgICAgICAgICAgICBgcm0gLXJmIG5vZGVfbW9kdWxlcy9AcHJpc21hL2NsaWVudC9ub2RlX21vZHVsZXMgbm9kZV9tb2R1bGVzLy5iaW4gbm9kZV9tb2R1bGVzL3ByaXNtYWAsXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIGNvbnN0IGRiU2V0dXBGbjEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdEYlNldHVwRnVuY3Rpb24nLCB7XG4gICAgLy8gICB2cGMsXG4gICAgLy8gICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLklTT0xBVEVEIH0sXG4gICAgLy8gICBzZWN1cml0eUdyb3VwczogW3ByaXZhdGVTZ10sXG4gICAgLy8gICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAvLyAgIGNvZGU6IG5ldyBsYW1iZGEuQXNzZXRDb2RlKCdsYW1iZGEtZm5zJyksXG4gICAgLy8gICBoYW5kbGVyOiAnZGJGdW5jdGlvbi5oYW5kbGVyJyxcbiAgICAvLyAgIG1lbW9yeVNpemU6IDEwMjQsXG4gICAgLy8gICB0aW1lb3V0OiBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXG4gICAgLy8gICBlbnZpcm9ubWVudDoge1xuICAgIC8vICAgICBTRUNSRVRfQVJOOiBjbHVzdGVyLnNlY3JldD8uc2VjcmV0QXJuIHx8ICcnLFxuICAgIC8vICAgICBBV1NfTk9ERUpTX0NPTk5FQ1RJT05fUkVVU0VfRU5BQkxFRDogJzEnLFxuICAgIC8vICAgfSxcbiAgICAvLyB9KVxuXG4gICAgY2x1c3Rlci5ncmFudERhdGFBcGlBY2Nlc3MoZGJTZXR1cEZuKVxuXG4gICAgY29uc3QgZGJTZXR1cEN1c3RvbVJlc291cmNlUHJvdmlkZXIgPSBuZXcgY3IuUHJvdmlkZXIodGhpcywgJ2RiU2V0dXBDdXN0b21SZXNvdXJjZVByb3ZpZGVyJywge1xuICAgICAgb25FdmVudEhhbmRsZXI6IGRiU2V0dXBGblxuICAgIH0pXG5cbiAgICBuZXcgY2RrLkN1c3RvbVJlc291cmNlKHRoaXMsICdzZXR1cEN1c3RvbVJlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBkYlNldHVwQ3VzdG9tUmVzb3VyY2VQcm92aWRlci5zZXJ2aWNlVG9rZW5cbiAgICB9KVxuXG5cbiAgICAvLyBSZXNvbHZlcnNcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiAnUXVlcnknLFxuICAgICAgZmllbGROYW1lOiAnZ2V0Q2FuZGlkYXRlcydcbiAgICB9KVxuXG4gICAgbGFtYmRhRHMuY3JlYXRlUmVzb2x2ZXIoe1xuICAgICAgdHlwZU5hbWU6ICdRdWVyeScsXG4gICAgICBmaWVsZE5hbWU6ICdnZXRNYXRjaGVzJ1xuICAgIH0pXG5cbiAgICBsYW1iZGFEcy5jcmVhdGVSZXNvbHZlcih7XG4gICAgICB0eXBlTmFtZTogJ011dGF0aW9uJyxcbiAgICAgIGZpZWxkTmFtZTogJ2NyZWF0ZVVzZXInXG4gICAgfSlcblxuICAgIGxhbWJkYURzLmNyZWF0ZVJlc29sdmVyKHtcbiAgICAgIHR5cGVOYW1lOiAnTXV0YXRpb24nLFxuICAgICAgZmllbGROYW1lOiAndXBkYXRlVXNlcidcbiAgICB9KVxuICB9XG59XG4iXX0=