var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import srp from "secure-remote-password/client";
import { call } from "./lib/cognito-service";
import { success, failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = srp.generateSalt();
        const clientKey = srp.derivePrivateKey(salt, event.USERNAME, event.PASSWORD);
        const verifier = srp.deriveVerifier(clientKey);
        const authParams = {
            AuthFlow: "USERNAME_SRP_AUTH",
            AuthParameters: {
                USERNAME: event.USERNAME,
                SRP_A: clientKey
            },
            ClientId: "27cus2iiajkktqa6tk984jqgqa"
        };
        try {
            const response = yield call('initiateAuth', authParams);
            const responseParams = {
                ChallengeName: response.ChallengeName,
                ChallengeParameters: response.ChallengeParameters,
                ClientId: authParams.ClientId
            };
            yield call('respondToAuthChallenge', responseParams);
            callback(null, success({ status: true }));
        }
        catch (error) {
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=user-signin.js.map