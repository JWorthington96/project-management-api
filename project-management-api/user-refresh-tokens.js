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
        const params = {
            AuthFlow: "REFRESH_TOKEN_AUTH",
            AuthParameters: {
                "REFRESH_TOKEN": event.queryStringParameters.RefreshToken
            },
            ClientId: "27cus2iiajkktqa6tk984jqgqa"
        };
        try {
            const response = yield call('initiateAuth', params);
            const accessToken = JSON.parse(Buffer.from(response.AuthenticationResult.AccessToken.split('.')[1], 'base64').toString('utf8'));
            console.log(accessToken);
            const idToken = JSON.parse(Buffer.from(response.AuthenticationResult.IdToken.split('.')[1], 'base64').toString('utf8'));
            console.log(idToken);
            callback(null, success({ status: true, body: {
                    AccessToken: response.AuthenticationResult.AccessToken,
                    IdToken: response.AuthenticationResult.IdToken,
                    IssuedAt: Math.min(accessToken["iat"], idToken["iat"]),
                    Expiration: Math.min(accessToken["exp"], idToken["exp"])
                }
            }));
        }
        catch (error) {
            callback(null, failure({ status: false, body: error }));
        }
    });
}
//# sourceMappingURL=user-refresh-tokens.js.map