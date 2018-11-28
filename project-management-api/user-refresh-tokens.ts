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
        const response = await call('initiateAuth', params);

        const accessToken = JSON.parse(Buffer.from(response.AuthenticationResult.AccessToken.split('.')[1], 'base64').toString('utf8'));
        console.log(accessToken);
        const idToken = JSON.parse(Buffer.from(response.AuthenticationResult.IdToken.split('.')[1], 'base64').toString('utf8'));
        console.log(idToken);

        callback(null, success({status: true, body: {
                AccessToken: response.AuthenticationResult.AccessToken,
                IdToken: response.AuthenticationResult.IdToken,
                IssuedAt: Math.min(accessToken["iat"], idToken["iat"]),
                Expiration: Math.min(accessToken["exp"], idToken["iat"])
            }
        }));
    } catch (error) {
        callback(null, failure({status: false, body: error}));
    }
}