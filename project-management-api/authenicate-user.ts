import {call} from "./lib/cognito-service";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const params = {
        ClientId: "43inla4asilb5vo5l5su5sp548",
        Username: event.Username,
        Password: event.Password,
        UserAttributes: [{
            "Name": "email",
            "Value": event.Email
        },
            {
                "Name": "custom:skills",
                "Value": event.Skills
            }
        ],
        ValidationData: null
    };

    try {
        const response = await call('signUp', params);
        if (response.UserConfirmed){
            callback(null, success({status: false, body: "Please confirm the hash"}));
        } else {
            callback(null, success({status: true}));
        }
    } catch (error) {
        callback(null, failure({status: false}));
    }
}