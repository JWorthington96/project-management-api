import AWS from "aws-sdk";
AWS.config.update({ region: "eu-west-2" });
AWS.config.apiVersions = { cognitoidentityserviceprovider: "2016-04-18" };
export function call(action, params) {
    const cognito = new AWS.CognitoIdentityServiceProvider();
    return cognito[action](params).promise();
}
//# sourceMappingURL=cognito-service.js.map