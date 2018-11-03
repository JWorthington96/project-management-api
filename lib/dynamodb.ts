// Library for returning the DynamoDB table
import AWS from "aws-sdk";

AWS.config.update({region: "eu-west-2"});

export function call(action: string, params){
    const dynamoDb = new AWS.DynamoDB.DocumentClient();
    // Using promises to allow asynchronous code
    return dynamoDb[action](params).promise();
}