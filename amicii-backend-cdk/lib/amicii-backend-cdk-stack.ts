import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as rds from '@aws-cdk/aws-rds'
import * as lambda from '@aws-cdk/aws-lambda'
import * as cognito from '@aws-cdk/aws-cognito'
import * as cr from '@aws-cdk/custom-resources'
import { Duration } from "@aws-cdk/aws-appsync/node_modules/@aws-cdk/core/lib/duration";
import { Expiration } from "@aws-cdk/aws-appsync/node_modules/@aws-cdk/core/lib/expiration";


export class AmiciiBackendCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'AmiciiUserPool', {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      autoVerify: { email: true },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    })

    new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool
    })

    const api = new appsync.GraphqlApi(this, 'AmiciiApi', {
      name: 'cdk-amicii-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365))
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

    const vpc = new ec2.Vpc(this, 'AmiciiVPC')

    const cluster = new rds.ServerlessCluster(this, 'AuroraAmiciiCluster', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      defaultDatabaseName: 'AmiciiDB',
      vpc: vpc,
      scaling: { autoPause: Duration.seconds(0) }
    })

    const dbSetupFn = new lambda.Function(this, 'DbSetupFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: new lambda.AssetCode('lambda-fns'),
      handler: 'dbFunction.handler',
      memorySize: 1024,
      environment: {
        CLUSTER_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret?.secretArn || '',
        DB_NAME: 'AmiciiDB',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
      }
    })

    cluster.grantDataApiAccess(dbSetupFn)

    const dbSetupCustomResourceProvider = new cr.Provider(this, 'dbSetupCustomResourceProvider', {
      onEventHandler: dbSetupFn
    })

    new cdk.CustomResource(this, 'setupCustomResource', {
      serviceToken: dbSetupCustomResourceProvider.serviceToken
    })

    const userFn = new lambda.Function(this, 'UserFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: new lambda.AssetCode('lambda-fns'),
      handler: 'index.handler',
      memorySize: 1024,
      environment: {
        CLUSTER_ARN: cluster.clusterArn,
        SECRET_ARN: cluster.secret?.secretArn || '',
        DB_NAME: 'AmiciiDB',
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
      }
    })

    cluster.grantDataApiAccess(userFn)

    const lambdaDs = api.addLambdaDataSource('lambdaDataSource', userFn)

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getCandidates'
    })

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getMatches'
    })

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'createUser'
    })

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'updateUser'
    })
  }
}
