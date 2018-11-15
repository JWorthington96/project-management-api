import {call} from "./lib/iam";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const policyParams = {
        PolicyDocument: JSON.stringify(event.PolicyDocument),
        PolicyName: event.RoleName + "Policy",
        Description: "Policy for " + event.RoleName + ":" + event.Description
    };

    try {
        const policy = await call('createPolicy', policyParams);
        let policyArn = policy.Arn;

        const roleParams = {
            AssumeRolePolicyDocument: JSON.stringify(event.AssumeRolePolicyDocument),
            RoleName: event.RoleName,
            Description: event.Description
        };
        await call('createRole', roleParams);

        // hard coded the ARN as the policy object wasn't returning it's arn
        if (policyArn === undefined) {
            policyArn = "arn:aws:iam::401633837556:policy/" + event.RoleName + "Policy";
        }

        const attachParams = {
            RoleName: event.RoleName,
            PolicyArn: policyArn
        };
        await call('attachRolePolicy', attachParams);
        callback(null, success({status: true}));
    } catch (error) {
        //console.error(error);
        callback(null, failure({status: false, error: error.message}));
    }
}