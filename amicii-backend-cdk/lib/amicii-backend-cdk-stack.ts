import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as rds from '@aws-cdk/aws-rds'
import * as ln from '@aws-cdk/aws-lambda-nodejs'
import * as lambda from '@aws-cdk/aws-lambda'
import * as cognito from '@aws-cdk/aws-cognito'
import * as iam from '@aws-cdk/aws-iam'
import * as cr from '@aws-cdk/custom-resources'
import { join } from 'path';

const userFnPath = join(__dirname, '..', 'lambda-fns', 'index.ts')
const setupFnPath = join(__dirname, '..', 'lambda-fns', 'dbFunction.ts')
export class AmiciiBackendCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //Import userpool fron Amplify
    const userPool = cognito.UserPool.fromUserPoolId(this, 'amicii-ammplify-user-pool', 'eu-west-2_4XkW19bmv')

    new cognito.UserPoolClient(this, "UserPoolClient", { userPool })


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
    })

    new cdk.CfnOutput(this, 'aws_appsynch_graphqlEndpoint', {
      value: api.graphqlUrl
    })

    new cdk.CfnOutput(this, 'aws_appsynch_apikey', {
      value: api.apiKey || ''
    })

    new cdk.CfnOutput(this, 'aws_appsynch_authenticationType', {
      value: 'API_KEY'
    })


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
    })


    const privateSg = new ec2.SecurityGroup(this, 'private-sg', {
      vpc,
      securityGroupName: 'private-sg',
    })
    privateSg.addIngressRule(
      privateSg,
      ec2.Port.allTraffic(),
      'allow internal SG access'
    )

    const subnetGroup = new rds.SubnetGroup(this, 'rds-subnet-group', {
      vpc,
      subnetGroupName: 'aurora-subnet-group',
      vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      description: 'An all private subnets group for the DB',
    })

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
    })

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
        SECRET_ARN: cluster.secret?.secretArn || '',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
      bundling: {
        nodeModules: ['@prisma/client', 'prisma'],
        commandHooks: {
          beforeBundling(_inputDir: string, _outputDir: string) {
            return []
          },
          beforeInstall(_inputDir: string, outputDir: string) {
            return [`cp -R ${join(__dirname, '..', 'lambda-fns', 'prisma')} ${outputDir}/`]
          },
          afterBundling(_inputDir: string, outputDir: string) {
            return [
              `cd ${outputDir}`,
              `yarn prisma generate`,
              `rm -rf node_modules/@prisma/engines`,
              `rm -rf node_modules/@prisma/client/node_modules node_modules/.bin node_modules/prisma`,
            ]
          },
        },
      },
    })

    // Give access to Secret Manager
    userFn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['secretsmanager:GetSecretValue'],
        resources: [cluster.secret?.secretArn || ''],
      })
    )

    new ec2.InterfaceVpcEndpoint(this, 'secrets-manager', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      vpc,
      privateDnsEnabled: true,
      subnets: { subnetType: ec2.SubnetType.ISOLATED },
      securityGroups: [privateSg],
    })

    const lambdaDs = api.addLambdaDataSource('lambdaDataSource', userFn)

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
        SECRET_ARN: cluster.secret?.secretArn || '',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
      bundling: {
        nodeModules: ['@prisma/client', 'prisma'],
        commandHooks: {
          beforeBundling(_inputDir: string, _outputDir: string) {
            return []
          },
          beforeInstall(_inputDir: string, outputDir: string) {
            return [`cp -R ${join(__dirname, '..', 'lambda-fns', 'prisma')} ${outputDir}/`]
          },
          afterBundling(_inputDir: string, outputDir: string) {
            return [
              `cd ${outputDir}`,
              `yarn prisma generate`,
              `rm -rf node_modules/@prisma/engines`,
              `rm -rf node_modules/@prisma/client/node_modules node_modules/.bin node_modules/prisma`,
            ]
          },
        },
      },
    })

    cluster.grantDataApiAccess(dbSetupFn)

    const dbSetupCustomResourceProvider = new cr.Provider(this, 'dbSetupCustomResourceProvider', {
      onEventHandler: dbSetupFn
    })

    new cdk.CustomResource(this, 'setupCustomResource', {
      serviceToken: dbSetupCustomResourceProvider.serviceToken
    })


    // Resolvers

    const resolvers = [
      { typeName: 'Query', fieldName: 'user' },
      { typeName: 'Query', fieldName: 'candidates' },
      { typeName: 'Query', fieldName: 'matches' },
      { typeName: 'Mutation', fieldName: 'createUser' },
      { typeName: 'Mutation', fieldName: 'updateUser' },
      { typeName: 'Mutation', fieldName: 'likeUser' },
      { typeName: 'Mutation', fieldName: 'dislikeUser' }
    ]

    for ( let { typeName, fieldName } of resolvers) {
      lambdaDs.createResolver({ typeName, fieldName })
    }
  }
}
