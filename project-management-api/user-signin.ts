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
        event.requestContext.identity.cognitoIdentityId = await cognitoIdentity.call('getId', identityParams);

        callback(null, success({status: true, body: response.AuthenticationResult}));
    } catch (error) {
        callback(null, failure({status: false, body: error}));
    }
}