import uuid from "uuid/v1";
import srp from "secure-remote-password/client";
import {call} from "./lib/cognito-service";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const salt = srp.generateSalt();
    const clientKey = srp.derivePrivateKey(salt, event.USERNAME, event.PASSWORD);
    const verifier = srp.deriveVerifier(clientKey);

    const authParams = {
        AuthFlow: "USERNAME_SRP_AUTH",
        AuthParameters: {
            USERNAME: event.USERNAME,
            SRP_A: clientKey
        },
        ClientId: "27cus2iiajkktqa6tk984jqgqa"
    };

    try {
        const response = await call('initiateAuth', authParams);

        const responseParams = {
            ChallengeName: response.ChallengeName,
            ChallengeParameters: response.ChallengeParameters,
            ClientId: authParams.ClientId
        };

        await call('respondToAuthChallenge', responseParams);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error.message}))
    }
}