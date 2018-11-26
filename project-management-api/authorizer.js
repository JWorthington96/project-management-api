import { failure } from "./lib/response";
const createPolicy = (principalId, effect, resource) => {
    const response = {};
    response[principalId] = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument["Version"] = '2012-10-17';
        policyDocument["Statement"] = [];
        const statement = {};
        statement["Action"] = 'execute-api:Invoke';
        statement["Effect"] = effect;
        statement["Resource"] = resource;
        policyDocument["Statement"][0] = statement;
        response["policyDocument"] = policyDocument;
    }
    return response;
};
export function user(event, context, callback) {
    if (typeof event.authorizationToken === 'undefined') {
        callback(null, failure({ status: false, body: "Unauthorized" }));
    }
    const tokenHeader = JSON.parse(Buffer.from(event.authorizationToken.split('.')[0], 'base64').toString('utf8'));
    const tokenBody = JSON.parse(Buffer.from(event.authorizationToken.split('.')[1], 'base64').toString('utf8'));
    console.log(tokenHeader);
    console.log(tokenBody);
    switch (tokenBody.iss) {
        case "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6":
            callback(null, createPolicy(tokenBody['cognito:username'], "Allow", "*"));
            break;
        default:
            callback(null, failure({ status: false, body: "Unauthorized" }));
    }
}
//# sourceMappingURL=authorizer.js.map