const AWS = require("aws-sdk");
import createLolly from "./createLolly";
import getAllLollies from "./getAllLollies";
import getLollyByPath from "./getLollyByPath";
import Lolly from "./Lolly";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    lolly: Lolly;
    lollyPath: string;
  };
};
function helper(body: Lolly) {
  const eventBridge = new AWS.EventBridge();

  return eventBridge
    .putEvents({
      Entries: [
        {
          EventBusName: "default",
          Source: "lollyRule",
          DetailType: "Event trigger from lolly lambda",
          Detail: `{ "Event": "${body.message}" }`,
        },
      ],
    })
    .promise();
}

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case "createLolly":
      const e = await helper(event.arguments.lolly);
      return await createLolly(event.arguments.lolly);
    case "getAllLollies":
      return await getAllLollies();

    case "getLollyByPath":
      return await getLollyByPath(event.arguments.lollyPath);

    default:
      return null;
  }
};
