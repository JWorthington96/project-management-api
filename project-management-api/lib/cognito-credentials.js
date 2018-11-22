import AWS from "aws-sdk";
AWS.config.region = "eu-west-2";
export function call(action) {
    const cognitoIdentity = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "eu-west-2:16e65f15-a1f6-4c57-b896-108cdd4593b6"
    });
    return cognitoIdentity[action]();
}
//# sourceMappingURL=cognito-identity.js.map