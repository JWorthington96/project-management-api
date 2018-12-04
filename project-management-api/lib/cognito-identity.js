import AWS from "aws-sdk";
AWS.config.region = "eu-west-2";
AWS.config.logger = console;
export function call(action, params) {
    const cognitoIdentity = new AWS.CognitoIdentity();
    return cognitoIdentity[action](params).promise();
}
//# sourceMappingURL=cognito-identity.js.map