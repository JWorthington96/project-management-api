import {call} from "./lib/cognito-service";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);
    const authParams = {
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        AuthParameters: {
            USERNAME: input.Username,
            PASSWORD: input.Password
        },
        ClientId: "27cus2iiajkktqa6tk984jqgqa",
        UserPoolId: "eu-west-2_7DRbUQOk6"
    };

    try {
        const response = await call('adminInitiateAuth', authParams);
        /*
        if (response.ChallengeName !== undefined){
            const challengeParams = {
                ChallengeName: response.ChallengeName,
                ChallengeParameters: response.ChallengeParameters,
                ClientId: authParams.ClientId,
                Session: response.Session
            };
            await call('respondToAuthChallenge', challengeParams);
        } else {
            const authResultParams = {
                AuthenticationResult: response.AuthenticationResult
            }
        }
        */
        /*
        if (response.ChallengeParameters.SRP_B === clientKey) {
            console.log("SRP_A is equal to SRP_B");
        } else {
            console.log("SRP_A not equal to SRP_B");
        }
        */
        callback(null, success({status: true, body: response}));
    } catch (error) {
        callback(null, failure({status: false, body: error.message}))
    }
}