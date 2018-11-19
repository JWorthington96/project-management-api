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
        const authParams = {
            AuthFlow: "ADMIN_NO_SRP_AUTH",
            AuthParameters: {
                USERNAME: event.USERNAME,
                PASSWORD: event.PASSWORD
            },
            ClientId: "27cus2iiajkktqa6tk984jqgqa",
            UserPoolId: "eu-west-2_7DRbUQOk6"
        };
        try {
            const response = yield call('adminInitiateAuth', authParams);
            /*
            if (response.ChallengeName !== undefined){
                const challengeParams = {
                    ChallengeName: response.ChallengeName,
                    ChallengeParameters: response.ChallengeParameters,
                    ClientId: authParams.ClientId,
                    Session: response.Session
                };
                await call('respondToAuthChallenge', challengeParams);
            } else {
                const authResultParams = {
                    AuthenticationResult: response.AuthenticationResult
                }
            }
            */
            /*
            if (response.ChallengeParameters.SRP_B === clientKey) {
                console.log("SRP_A is equal to SRP_B");
            } else {
                console.log("SRP_A not equal to SRP_B");
            }
            */
            callback(null, success({ status: true, body: response }));
        }
        catch (error) {
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=user-signin.js.map