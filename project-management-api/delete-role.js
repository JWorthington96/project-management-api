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
        const roleParams = {
            RoleName: event.RoleName
        };
        try {
            const response = yield call('listAttachedRolePolicies', roleParams);
            const policyParams = {
                PolicyArn: response.AttachedPolicies[0].PolicyArn
            };
            const detachParams = {
                PolicyArn: response.AttachedPolicies[0].PolicyArn,
                RoleName: event.RoleName
            };
            yield call('detachRolePolicy', detachParams);
            yield call('deletePolicy', policyParams);
            yield call('deleteRole', roleParams);
            callback(null, success({ status: true }));
        }
        catch (error) {
            console.error(error);
            callback(null, failure({ status: false }));
        }
    });
}
//# sourceMappingURL=delete-role.js.map