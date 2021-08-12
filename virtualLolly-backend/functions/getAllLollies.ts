const AWS = require("aws-sdk")
const docClient = new AWS.DynamoDB.DocumentClient()

async function getAllLollies() {
  const params = {
    TableName: process.env.LOLLY_TABLE,
  }
  try {
    const data = await docClient.scan(params).promise()
    return data.Items
  } catch (err) {
    console.log("DynamoDB error: ", err)
    return null
  }
}
export default getAllLollies
