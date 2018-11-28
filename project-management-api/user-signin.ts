const crypto = require('crypto');
import * as cognito from "./lib/cognito";
import * as cognitoIdentity from "./lib/cognito-identity";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);
    const authParams = {
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
            USERNAME: input.Username,
            PASSWORD: input.Password
        },
        ClientId: "27cus2iiajkktqa6tk984jqgqa"
    };

    try {
        const response = await cognito.call('initiateAuth', authParams);

        const accessToken = JSON.parse(Buffer.from(response.AuthenticationResult.AccessToken.split('.')[1], 'base64').toString('utf8'));
        console.log(accessToken);
        const idToken = JSON.parse(Buffer.from(response.AuthenticationResult.IdToken.split('.')[1], 'base64').toString('utf8'));
        console.log(idToken);


        const identityParams = {
            IdentityPoolId: "eu-west-2:b21c24c2-a661-4a66-9c5a-d8b51f02f3f3",
            Logins: {
                "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6": response.AuthenticationResult.IdToken
            }
        };
        const identity = await cognitoIdentity.call('getId', identityParams);

        callback(null, success({status: true, body: {
                Auth: response.AuthenticationResult,
                IdentityId: identity.IdentityId,
                sub: accessToken.sub
            }
        }));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}