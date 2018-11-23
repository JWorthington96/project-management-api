// Library for returning the DynamoDB table
import AWS from "aws-sdk";
AWS.config.region = "eu-west-2";
AWS.config.logger = console;
export function call(action, params) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    // Using promises to allow asynchronous code
    return dynamoDb[action](params).promise();
}
//# sourceMappingURL=dynamodb.js.map