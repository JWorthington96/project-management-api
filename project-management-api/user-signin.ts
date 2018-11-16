import {call} from "./lib/cognito-service";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const params = {
        AuthFlow: "USER_SRP_AUTH",
        AuthParameters: {
            USERNAME: event.Username,
            SRP_A: ""
        }
    }
}