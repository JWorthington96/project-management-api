import {call} from "./lib/iam";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const roleParams = {RoleName: event.RoleName}

    const newRoleParams = {
        RoleName: event.RoleName,
        Description: event.Description
    };

    const policyParams = {
        PolicyDocument: JSON.stringify(event.PolicyDocument),
        PolicyName: event.RoleName + "Policy"
    };

    try {
        // first detach and delete the current policy
        const response1 = await call('listAttachedRolePolicies', roleParams);
        const oldPolicyParams = {
            PolicyArn: response1.AttachedPolicies[0].PolicyArn
        };
        const detachParams = {
            PolicyArn: response1.AttachedPolicies[0].PolicyArn,
            RoleName: event.RoleName
        };
        await call('detachRolePolicy', detachParams);
        await call('deletePolicy', oldPolicyParams);

        // then create a new one to replace it
        const response2 = await call('createPolicy', policyParams);
        const attachParams = {
            PolicyArn: response2.Policy.Arn,
            RoleName: event.RoleName
        };
        await call('attachRolePolicy', attachParams);

        // finally update and description changes
        await call('updateRole', newRoleParams);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error.message}))
    }
}