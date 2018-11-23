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
        /*
        // TODO: add password reset with this basic structure
        const challengeParams = {
            ChallengeName: response.ChallengeName,
            ChallengeParameters: response.ChallengeParameters,
            ClientId: "27cus2iiajkktqa6tk984jqgqa"
        };
        if (challengeParams.ChallengeName === undefined){
            const authResponse = await cognito.call('respondToAuthChallenge', challengeParams);
        }
        */

        /*
        const tokenHeader = JSON.parse(Buffer.from(response.AuthenticationResult.IdToken.split('.')[0], 'base64').toString('utf8'));
        const tokenBody = JSON.parse(Buffer.from(response.AuthenticationResult.IdToken.split('.')[1], 'base64').toString('utf8'));
        console.log(tokenHeader);
        console.log(tokenBody);
        */

        const identityParams = {
            IdentityPoolId: "eu-west-2:16e65f15-a1f6-4c57-b896-108cdd4593b6",
            Logins: {
                "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6": response.AuthenticationResult.IdToken
            }
        };
        // Gets (or generates) identity token for specified user pool login
        const identity = await cognitoIdentity.call('getId', identityParams);

        const credentialParams = {
            IdentityId: identity.IdentityId,
            Logins: {
                "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6": response.AuthenticationResult.IdToken
            }
        };
        // Returns IAM credentials to use AWS services in the app of the specified ID
        const credentials = await cognitoIdentity.call('getCredentialsForIdentity', credentialParams);

        callback(null, success({status: true, body: {
                Auth: response.AuthenticationResult,
                IdentityId: identity.IdentityId,
                Credentials: credentials.Credentials
            }
        }));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false}));
    }
}