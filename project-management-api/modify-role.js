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
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const roleParams = { RoleName: event.RoleName };
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
            const response1 = yield call('listAttachedRolePolicies', roleParams);
            const oldPolicyParams = {
                PolicyArn: response1.AttachedPolicies[0].PolicyArn
            };
            const detachParams = {
                PolicyArn: response1.AttachedPolicies[0].PolicyArn,
                RoleName: event.RoleName
            };
            yield call('detachRolePolicy', detachParams);
            yield call('deletePolicy', oldPolicyParams);
            // then create a new one to replace it
            const response2 = yield call('createPolicy', policyParams);
            const attachParams = {
                PolicyArn: response2.Policy.Arn,
                RoleName: event.RoleName
            };
            yield call('attachRolePolicy', attachParams);
            // finally update and description changes
            yield call('updateRole', newRoleParams);
            callback(null, success({ status: true }));
        }
        catch (error) {
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=modify-role.js.map