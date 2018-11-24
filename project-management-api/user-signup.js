var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { call } from "./lib/cognito";
import { success, failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = JSON.parse(event.body);
        const params = {
            Username: input.Username,
            Password: input.Password,
            ClientId: "27cus2iiajkktqa6tk984jqgqa",
            UserAttributes: [
                {
                    "Name": "email",
                    "Value": input.Email
                },
                {
                    "Name": "custom:skills",
                    "Value": input.Skills
                }
            ],
            ValidationData: null
            //eu-west-2_7DRbUQOk6
        };
        try {
            yield call('signUp', params);
            callback(null, success({ status: true }));
        }
        catch (error) {
            console.log(error);
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=user-signup.js.map