import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const input = JSON.parse(event.body);
    const params = {
        AccessToken: input.AccessToken,
        UserAttributes: [
            {
                Name: "email",
                Value: input.Email
            },
            {
                Name: "custom:skills",
                Value: input.skills
            }
        ]
    };

    try {
        await call('updateUserAttributes', params);
        callback(null, success({status: true}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}