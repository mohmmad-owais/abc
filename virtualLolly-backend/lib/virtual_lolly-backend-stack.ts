import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import * as ddb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as events from "@aws-cdk/aws-events";
import * as targets from "@aws-cdk/aws-events-targets";

export class VirtualLollyBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const api = new appsync.GraphqlApi(this, "Api", {
      name: "cdk-lolly-appsync-api",
      schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      logConfig: { fieldLogLevel: appsync.FieldLogLevel.ALL },
      xrayEnabled: true,
    });

    const lollyLambda = new lambda.Function(this, "AppSyncNotesHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: "main.handler",
      code: lambda.Code.fromAsset("functions"),
      memorySize: 1024,
    });

    // Grant the lambda permission to put custom events on eventbridge
    events.EventBus.grantAllPutEvents(lollyLambda);

    const consumerLambda = new lambda.Function(this, "consumerFunction", {
      code: lambda.Code.fromInline(
        "exports.handler = (event, context) => { console.log(event); context.succeed(event); }"
      ),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_12_X,
    });

    const lambdaDs = api.addLambdaDataSource("lambdaDatasource", lollyLambda);

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getAllLollies",
    });

    lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "createLolly",
    });

    lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "getLollyByPath",
    });

    const lollyTable = new ddb.Table(this, "CDKLollyTable", {
      partitionKey: {
        name: "lollyPath",
        type: ddb.AttributeType.STRING,
      },
    });
    lollyTable.grantFullAccess(lollyLambda);
    lollyLambda.addEnvironment("LOLLY_TABLE", lollyTable.tableName);

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, "Stack Region", {
      value: this.region,
    });

    // The rule that filters events to match country == "PK" and sends them to the consumer Lambda.
    const rule = new events.Rule(this, "lollyLambdaRule", {
      targets: [new targets.LambdaFunction(consumerLambda)],
      description: "Filter events that come from lolly Lambda",
      eventPattern: {
        source: ["lollyRule"],
      },
    });
  }
}
