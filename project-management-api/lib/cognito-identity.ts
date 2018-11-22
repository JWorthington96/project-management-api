import AWS from "aws-sdk";

AWS.config.region = "eu-west-2";
/*
const initialCredentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: "eu-west-2:16e65f15-a1f6-4c57-b896-108cdd4593b6"
});
initialCredentials.get(error => {
    console.log(error);
});
initialCredentials.refresh(error => {
    console.log(error);
});
AWS.config.credentials = initialCredentials;
console.log(AWS.config.credentials);
*/

export function getCredentials(params) {
    // temporary
    const cognitoCredentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "eu-west-2:16e65f15-a1f6-4c57-b896-108cdd4593b6",
        Logins: {
            "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6": params.AccessToken
        }
    });
    cognitoCredentials.get(error => {
        if (error) {
            console.log(error);
            throw error;
        }
    });
    return cognitoCredentials;
}

export function call(action: string, params){
    //AWS.config.credentials = getCredentials(params);
    //console.log(AWS.config.credentials);
    /*
    const cognitoCredentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "eu-west-2:16e65f15-a1f6-4c57-b896-108cdd4593b6",
        Logins: {
            "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6": params.AccessToken
        }
    });
    cognitoCredentials.refresh(err => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
    AWS.config.update({credentials: cognitoCredentials});
    */

    const cognitoIdentity = new AWS.CognitoIdentity();
    return cognitoIdentity[action](params).promise();
}