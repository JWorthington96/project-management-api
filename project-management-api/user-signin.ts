import {call} from "./lib/cognito-service";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);
    const authParams = {
        AuthFlow: "USER_PASSWORD_AUTH",
        AuthParameters: {
            USERNAME: input.Username,
            PASSWORD: input.Password
        },
        ClientId: "27cus2iiajkktqa6tk984jqgqa"
        //UserPoolId: "eu-west-2_7DRbUQOk6"
    };

    function UserSession(session){
        this.session = session;
    }

    UserSession.prototype = {
        setSession: function(session){
            this.session = session;
        },
        getSession: function() {
            return this.session;
        }
    };

    try {
        const response = await call('initiateAuth', authParams);
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

        const userSession = new Promise(new UserSession(response.AuthenticationResult));
        callback(null, success({status: true, body: userSession}));
    } catch (error) {
        callback(null, failure({status: false, body: "No username/password combination found"}));
    }
}