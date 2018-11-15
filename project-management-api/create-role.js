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
            const response = yield call('createPolicy', policyParams);
            const attachParams = {
                RoleName: event.RoleName,
                PolicyArn: response.Policy.Arn
            };
            yield call('createRole', roleParams);
            yield call('attachRolePolicy', attachParams);
            callback(null, success({ status: true }));
        }
        catch (error) {
            //console.error(error);
            callback(null, failure({ status: false, error: error.message }));
        }
    });
}
//# sourceMappingURL=create-role.js.map