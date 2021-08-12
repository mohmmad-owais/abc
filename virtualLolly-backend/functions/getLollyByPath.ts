const AWS = require("aws-sdk")
const docClient = new AWS.DynamoDB.DocumentClient()

async function getLollyByPath(lollyPath: string) {
  const params = {
    TableName: process.env.LOLLY_TABLE,
    Key: { lollyPath: lollyPath },
  }
  try {
    const { Item } = await docClient.get(params).promise()
    return Item
  } catch (err) {
    console.log("DynamoDB error: ", err)
    return null
  }
}

export default getLollyByPath
