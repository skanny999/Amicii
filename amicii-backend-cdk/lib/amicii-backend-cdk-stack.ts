import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as ec2 from '@aws-cdk/aws-ec2'
import * as rds from '@aws-cdk/aws-rds'
import {Duration} from "@aws-cdk/aws-appsync/node_modules/@aws-cdk/core/lib/duration";


export class AmiciiBackendCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'AmiciiApi', {
      name: 'cdk-amicii-appsync-api',
      schema: appsync.Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL
        }
      }
    })

    const vpc = new ec2.Vpc(this, 'AmiciiVPC')

    const cluster = new rds.ServerlessCluster(this, 'AuroraAmiciiCluster', {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, 'ParameterGroup', 'default.aurora-mysql'),
      defaultDatabaseName: 'AmiciiDB',
      vpc: vpc,
      scaling: { autoPause: Duration.seconds(0) }
    })
  }
}
