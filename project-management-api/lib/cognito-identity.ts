import AWS from "aws-sdk";

AWS.config.region = "eu-west-2";
AWS.config.logger = console;

export function call(action: string, params){
    const cognitoIdentity = new AWS.CognitoIdentity();
    return cognitoIdentity[action](params).promise();
}