import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    console.log(event.requestContext);
    console.log(context);
    const params = {
        AccessToken: event.headers.Authorization
    };

    try {
        const user = await call('getUser', params);
        callback(null, success({status: true, body: user}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: {
                error: error.message,
                context: event.requestContext
            }
        }));
    }
}