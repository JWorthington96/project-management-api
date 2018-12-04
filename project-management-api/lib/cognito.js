import AWS from "aws-sdk";
AWS.config.region = "eu-west-2";
AWS.config.logger = console;
export function call(action, params) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    return cognito[action](params).promise();
}
//# sourceMappingURL=cognito.js.map