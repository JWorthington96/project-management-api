import AWS from "aws-sdk";
AWS.config.update({ region: "eu-west-2" });
AWS.config.apiVersions = { cognitoidentity: "2014-06-30" };
export function call(action, params) {
}
//# sourceMappingURL=cognito.js.map