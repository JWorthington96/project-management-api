import {call} from "./lib/iam";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const params = {
        PolicyDocument: JSON.stringify(event.policyDocument),
        PolicyName: event.policyName,
        Description: event.description
    };

    try {
        await call('createPolicy', params);
        callback(null, success({status: true}));
    } catch (error) {
        console.error(error);
        callback(null, failure({status: false, error: error.message}));
    }
}