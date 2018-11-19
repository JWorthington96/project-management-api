import {call} from "./lib/cognito-service";
import {success, failure} from "./lib/response";
import AWS from "aws-sdk";

export async function main(event, context, callback) {
    const authParams = {
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
            USERNAME: event.Username,
            PASSWORD: event.Password
        },
        ClientId: "27cus2iiajkktqa6tk984jqgqa",
        //UserPoolId: "eu-west-2_7DRbUQOk6"
    };

    

    const url = "oauth2/authorize?" +
        "response_type=token&" +
        "client_id=27cus2iiajkktqa6tk984jqgqa&" +
        "redirect_uri=/login" +
        "&state=STATE&" +
        "scope=aws.cognito.signin.user.admin";

    try {
        const response = await call('initiateAuth', authParams);

        /*
        const authResultParams = {
            ChallengeName: authParams.AuthFlow,
            AuthenticationResult: response.AuthenticationResult
        };

        await call('adminRespondToAuthChallenge', authResultParams);
        */

    } catch (error) {
        callback(null, failure({status: false, body: error.message}))
    }
}