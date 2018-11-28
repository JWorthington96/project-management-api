import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const params = {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        AuthParameters: {
            "REFRESH_TOKEN": event.queryStringParameters.RefreshToken
        },
        ClientId: "27cus2iiajkktqa6tk984jqgqa"
    };

    try {
        const result = await call('initiateAuth', params);
        callback(null, success({status: true, body: result.AuthenticationResult}));
    } catch (error) {
        callback(null, failure({status: false, body: error}));
    }
}