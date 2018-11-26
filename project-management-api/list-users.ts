import {call} from "./lib/cognito";
import {failure} from "./lib/response";

export async function main(event, context, callback){
    const params = {
        UserPoolId: "eu-west-2_7DRbUQOk6",
        AttributesToGet: [
            "username",
            "email",
            "custom:skills",
            "custom:projects"
        ]
    };

    try {
        const users = await call('listUsers', params);
        callback(users.Users);
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}