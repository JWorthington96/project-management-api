import {call} from "./lib/iam";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const input = JSON.parse(event.body);
    const roleParams = {
        RoleName: input.RoleName
    };

    try {
        const response = await call('listAttachedRolePolicies', roleParams);
        const policyParams = {
            PolicyArn: response.AttachedPolicies[0].PolicyArn
        };

        const detachParams = {
            PolicyArn: response.AttachedPolicies[0].PolicyArn,
            RoleName: roleParams.RoleName
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