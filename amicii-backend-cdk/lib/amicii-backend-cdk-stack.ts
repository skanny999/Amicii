import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as ec2 from '@aws-cdk/aws-ec2'


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
  }
}
