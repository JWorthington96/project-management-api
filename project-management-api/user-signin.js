var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { call } from "./lib/cognito-service";
import { failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const authParams = {
            AuthFlow: "USER_PASSWORD_AUTH",
            AuthParameters: {
                USERNAME: event.Username,
                PASSWORD: event.Password
            },
            ClientId: "27cus2iiajkktqa6tk984jqgqa",
        };
        const url = "oauth2/authorize?" +
            "response_type=token&" +
            "client_id=27cus2iiajkktqa6tk984jqgqa&" +
            "redirect_uri=/login" +
            "&state=STATE&" +
            "scope=aws.cognito.signin.user.admin";
        try {
            const response = yield call('initiateAuth', authParams);
            /*
            const authResultParams = {
                ChallengeName: authParams.AuthFlow,
                AuthenticationResult: response.AuthenticationResult
            };
    
            await call('adminRespondToAuthChallenge', authResultParams);
            */
        }
        catch (error) {
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=user-signin.js.map