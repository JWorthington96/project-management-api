import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const input = JSON.parse(event.body);
    const params = {
        ClientId: "27cus2iiajkktqa6tk984jqgqa",
        Username: input.Username
    };

    try {
        await call('resendConfirmationCode', params);
        callback(null, success({status: true}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error}));
    }
}