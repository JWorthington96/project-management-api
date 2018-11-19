import {call} from "./lib/cognito-service";
import {failure, success} from "./lib/response";


export async function main(event, context, callback){
    const params = {
        ClientId: "27cus2iiajkktqa6tk984jqgqa",
        ConfirmationCode: event.ConfirmationCode,
        Username: event.Username
    };

    try {
        await call('confirmSignUp', params);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error.message}));
    }
}