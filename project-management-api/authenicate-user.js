var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { call } from "./lib/cognito-service";
import { success, failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            ClientId: "43inla4asilb5vo5l5su5sp548",
            Username: event.Username,
            Password: event.Password,
            UserAttributes: [{
                    "Name": "email",
                    "Value": event.Email
                },
                {
                    "Name": "custom:skills",
                    "Value": event.Skills
                }
            ],
            ValidationData: null
        };
        try {
            const response = yield call('signUp', params);
            if (response.UserConfirmed) {
                callback(null, success({ status: false, body: "Please confirm the hash" }));
            }
            else {
                callback(null, success({ status: true }));
            }
        }
        catch (error) {
            callback(null, failure({ status: false }));
        }
    });
}
//# sourceMappingURL=authenicate-user.js.map