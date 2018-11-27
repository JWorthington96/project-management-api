var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            const accessToken = JSON.parse(Buffer.from(response.AuthenticationResult.AccessToken.split('.')[1], 'base64').toString('utf8'));
            console.log(accessToken);
            const idToken = JSON.parse(Buffer.from(response.AuthenticationResult.IdToken.split('.')[1], 'base64').toString('utf8'));
            console.log(idToken);
            const identityParams = {
                IdentityPoolId: "eu-west-2:b21c24c2-a661-4a66-9c5a-d8b51f02f3f3",
                Logins: {
                    "cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6": response.AuthenticationResult.IdToken
                }
            };
            const identity = yield cognitoIdentity.call('getId', identityParams);
            callback(null, success({ status: true, body: {
                    Auth: response.AuthenticationResult,
                    IdentityId: identity.IdentityId,
                    sub: accessToken.sub
                }
            }));
        }
        catch (error) {
            console.log(error);
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=user-signin.js.map