import {call} from "./lib/cognito-service";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const params = {
        Username: event.Username,
        Password: event.Password,
        ClientId: "27cus2iiajkktqa6tk984jqgqa",
        UserAttributes: [
            {
                "Name": "email",
                "Value": event.Email
            },
            {
                "Name": "custom:skills",
                "Value": event.Skills
            }
        ],
        ValidationData: null
        //eu-west-2_7DRbUQOk6
    };

    try {
        await call('signUp', params);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, error: error.message}));
    }
}