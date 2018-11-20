var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as iam from "./lib/iam";
import * as cognito from "./lib/cognito";
import { success, failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = JSON.parse(event.body);
        const roleParams = {
            RoleName: input.RoleName
        };
        try {
            const response = yield iam.call('getRole', roleParams);
            const groupParams = {
                GroupName: input.GroupName,
                Description: input.Description,
                RoleArn: response.Role.Arn,
                UserPoolId: "eu-west-2_7DRbUQOk6"
            };
            yield cognito.call('updateGroup', groupParams);
            callback(null, success({ status: true }));
        }
        catch (error) {
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=modify-group.js.map