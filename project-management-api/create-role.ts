import {call} from "./lib/iam";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const policyParams = {
        PolicyDocument: JSON.stringify(event.PolicyDocument),
        PolicyName: event.RoleName + "Policy",
        Description: "Policy for " + event.RoleName + ":" + event.Description
    };

    const roleParams = {
        AssumeRolePolicyDocument: JSON.stringify(event.AssumeRolePolicyDocument),
        RoleName: event.RoleName,
        Description: event.Description
    };

    try {
        const response = await call('createPolicy', policyParams);

        const attachParams = {
            RoleName: event.RoleName,
            PolicyArn: response.Policy.Arn
        };

        await call('createRole', roleParams);
        await call('attachRolePolicy', attachParams);

        callback(null, success({status: true}));
    } catch (error) {
        //console.error(error);
        callback(null, failure({status: false, error: error.message}));
    }
}