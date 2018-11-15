var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { call } from "./lib/iam";
import { success, failure } from "./lib/response";
import { createPolicy } from "./lib/create-policy";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminId = event.requestContext.identity.cognitoIdentityId;
        const projectId = event.pathParameters.id;
        const deleteBool = event.DeleteBoolean;
        const getBool = event.GetBoolean;
        const putBool = event.PutBoolean;
        const updateBool = event.UpdateBoolean;
        const policyDocument = JSON.stringify(createPolicy(adminId, projectId, deleteBool, getBool, putBool, updateBool));
        console.log(policyDocument);
        /*
        const roleParams = {RoleName: event.RoleName}
    
        const newRoleParams = {
            RoleName: event.RoleName,
            Description: event.Description
        };
    
        const policyParams = {
            PolicyDocument: policyDocument,
            PolicyName: event.RoleName + "Policy"
        };
        */
        const policyParams = {
            PolicyDocument: policyDocument,
            PolicyName: event.RoleName + "Policy",
            RoleName: event.RoleName
        };
        const roleParams = {
            RoleName: event.RoleName,
            Description: event.Description
        };
        try {
            /*
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
            */
            yield call('putRolePolicy', policyParams);
            yield call('updateRole', roleParams);
            callback(null, success({ status: true }));
        }
        catch (error) {
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=modify-role.js.map