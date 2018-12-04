import AWS from "aws-sdk";

AWS.config.region = "eu-west-2";
AWS.config.logger = console;

export function call(action: string, params) {
    const iam = new AWS.IAM({apiVersion: '2010-05-08'});
    return iam[action](params).promise();
}