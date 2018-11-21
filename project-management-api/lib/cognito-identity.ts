import AWS from "aws-sdk";

AWS.config.region = "eu-west-2";

export function call(action) {
    const cognitoIdentity = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "eu-west-2:50d5d904-6380-4eb3-9143-3464368f0b72"
    });
    return cognitoIdentity[action]();
}