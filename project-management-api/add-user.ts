import {call} from "./lib/cognito-service";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const params = {
        GroupName: event.GroupName,
        UserPoolId: "eu-west-2_QmN841UbB",
        Username: event.Username
    };

    try {
        await call('adminAddUserToGroup', params);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error.message}));
    }
}