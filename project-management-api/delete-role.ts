import {call} from "./lib/iam";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const roleParams = {
        RoleName: event.RoleName
    };

    try {
        const response = await call('listAttachedRolePolicies', roleParams);
        const policyParams = {
            PolicyArn: response.AttachedPolicies[0].PolicyArn
        };

        const detachParams = {
            PolicyArn: response.AttachedPolicies[0].PolicyArn,
            RoleName: event.RoleName
        };

        await call('detachRolePolicy', detachParams);
        await call('deletePolicy', policyParams);
        await call('deleteRole', roleParams);
        callback(null, success({status: true}))
    } catch (error) {
        console.error(error);
        callback(null, failure({status: false}))
    }
}