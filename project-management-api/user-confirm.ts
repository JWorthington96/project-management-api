import {call} from "./lib/cognito-service";
import {failure, success} from "./lib/response";


export async function main(event, context, callback){
    const input = JSON.parse(event.body);
    const params = {
        ClientId: "27cus2iiajkktqa6tk984jqgqa",
        ConfirmationCode: input.ConfirmationCode,
        Username: input.Username
    };

    try {
        await call('confirmSignUp', params);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error.valueOf()}));
    }
}