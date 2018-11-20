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
        const input = JSON.parse(event.body);
        const adminId = event.requestContext.identity.cognitoIdentityId;
        const projectId = event.pathParameters.id;
        const deleteBool = input.DeleteBoolean;
        const getBool = input.GetBoolean;
        const putBool = input.PutBoolean;
        const updateBool = input.UpdateBoolean;
        const policyDocument = JSON.stringify(createPolicy(adminId, projectId, deleteBool, getBool, putBool, updateBool));
        const policyParams = {
            PolicyDocument: policyDocument,
            PolicyName: input.RoleName + "Policy",
            RoleName: input.RoleName
        };
        const roleParams = {
            RoleName: input.RoleName,
            Description: input.Description
        };
        try {
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