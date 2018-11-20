import {call} from "./lib/cognito";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);
    const params = {
        GroupName: input.GroupName,
        UserPoolId: "eu-west-2_QmN841UbB"
    };

    try {
        await call('deleteGroup', params);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error}));
    }
}