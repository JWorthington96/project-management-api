import AWS from "aws-sdk";

AWS.config.update({region: "eu-west-2"});

export function call(action: string, params){
    const cognito = new AWS.CognitoIdentityServiceProvider();
    return cognito[action](params).promise();
}