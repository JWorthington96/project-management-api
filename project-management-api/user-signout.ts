import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const token = event.headers.Authorization.split('Bearer')[1].trim();
    const params = {
        AccessToken: token
    };

    try {
        await call('globalSignOut', params);
        callback(null, success({status: true}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}