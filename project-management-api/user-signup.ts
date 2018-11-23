import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const input = JSON.parse(event.body);
    const params = {
        Username: input.Username,
        Password: input.Password,
        ClientId: "27cus2iiajkktqa6tk984jqgqa",
        UserAttributes: [
            {
                "Name": "email",
                "Value": input.Email
            },
            {
                "Name": "custom:skills",
                "Value": input.Skills
            }
        ],
        ValidationData: null
        //eu-west-2_7DRbUQOk6
    };

    try {
        await call('signUp', params);
        callback(null, success({status: true}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}