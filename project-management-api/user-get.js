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
        const token = event.headers.Authorization.split('Bearer')[1].trim();
        const params = {
            AccessToken: token
        };
        try {
            const user = yield call('getUser', params);
            callback(null, success({ status: true, body: user }));
        }
        catch (error) {
            console.log(error);
            callback(null, failure({ status: false, body: { error: error.message } }));
        }
    });
}
//# sourceMappingURL=user-get.js.map