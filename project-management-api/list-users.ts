import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const params = {
        UserPoolId: "eu-west-2_7DRbUQOk6"
    };

    try {
        const users = await call('listUsers', params);
        console.log(users);
        callback(null, success(users));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}