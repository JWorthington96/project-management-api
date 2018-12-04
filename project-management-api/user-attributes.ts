import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const params = {
        AccessToken: event.queryStringParameters.AccessToken
    };

    try {
        const user = await call('getUser', params);
        callback(null, success({status: true, body: user}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}