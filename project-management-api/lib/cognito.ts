import AWS from "aws-sdk";

AWS.config.region = "eu-west-2";
AWS.config.logger = console;

export function call(action: string, params){
    const cognito = new AWS.CognitoIdentityServiceProvider();
    return cognito[action](params).promise();
}