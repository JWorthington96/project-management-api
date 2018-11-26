var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const crypto = require('crypto');
import * as cognito from "./lib/cognito";
import * as cognitoIdentity from "./lib/cognito-identity";
import { success, failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const input = JSON.parse(event.body);
        const authParams = {
            AuthFlow: "USER_PASSWORD_AUTH",
            AuthParameters: {
                USERNAME: input.Username,
                PASSWORD: input.Password
            },
            ClientId: "27cus2iiajkktqa6tk984jqgqa"
        };
        try {
            const response = yield cognito.call('initiateAuth', authParams);
            const identityParams = {
                IdentityPoolId: "eu-west-2:16e65f15-a1f6-4c57-b896-108cdd4593b6",
                Logins: {
                    "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6": response.AuthenticationResult.IdToken
                }
            };
            event.requestContext.identity.cognitoIdentityId = yield cognitoIdentity.call('getId', identityParams);
            callback(null, success({ status: true, body: response.AuthenticationResult }));
        }
        catch (error) {
            callback(null, failure({ status: false, body: error }));
        }
    });
}
//# sourceMappingURL=user-signin.js.map