import {failure} from "./lib/response";

// Resource needs a leading slash, effect is either "Allow" or "Deny"
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
        statement["Resource"] = "arn:aws:execute-api:eu-west-2:401633837556:tjj2y50rl6/*" + resource;
        policyDocument["Statement"][0] = statement;
        response["policyDocument"] = policyDocument;
    }
    return response;
};

const addToPolicy = (policy, effect, resource) => {
    const newPolicy = policy;
    if (effect && resource) {
        const statement = {};
        statement["Action"] = 'execute-api:Invoke';
        statement["Effect"] = effect;
        statement["Resource"] = "arn:aws:execute-api:eu-west-2:401633837556:tjj2y50rl6/*" + resource;
        newPolicy["policyDocument"]["Statement"].push(statement);
    }
    console.log(newPolicy);
    return newPolicy;
};

// Denies all resources
const denyPolicy = (principalId) => {
    createPolicy(principalId, "Deny", "*");
};

export function main(event, context, callback) {
    if (typeof event.authorizationToken === 'undefined') {
        callback(null, failure({status: false, body: "Unauthorized"}));
    }

    const tokenBody = JSON.parse(Buffer.from(event.authorizationToken.split('.')[1], 'base64').toString('utf8'));
    console.log(tokenBody);

    const adminProjectIds = tokenBody['cognito:adminProjects'].toString().split(',');
    const managerProjectIds = tokenBody['cognito:managerProjects'].toString().split(',');
    const developerProjectIds = tokenBody['cognito:devProjects'].toString().split(',');

    switch (tokenBody.iss) {
        // if the user is authenticated
        case "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6":
            let policy = denyPolicy(tokenBody['cognito:username']);
            policy = addToPolicy(policy, "Allow", "/*/projects");

            // admins will have access to all Lambda functions in the given project
            for (let i = 0; i < adminProjectIds.length; i++){
                const id = adminProjectIds[i];
                policy = addToPolicy(policy, "Allow", "/*/projects/" + id + "/*");
            }

            // project managers will have access to all Lambda functions, apart from deleting the project
            for (let i = 0; i < managerProjectIds.length; i++){
                const id = managerProjectIds[i];
                if (id in adminProjectIds === false) {
                    policy = addToPolicy(policy, "Allow", "/GET/projects/" + id + "/*");
                    policy = addToPolicy(policy, "Allow", "/PUT/projects/" + id + "/*");
                    policy = addToPolicy(policy, "Allow", "/POST/projects/" + id + "/*");
                    policy = addToPolicy(policy, "Allow", "/DELETE/projects/" + id + "/*");
                }
            }

            // developers will have access to all GET Lambda functions
            for (let i = 0; i < developerProjectIds.length; i++){
                const id = developerProjectIds[i];
                if (id in adminProjectIds === false && id in managerProjectIds === false) {
                    policy = addToPolicy(policy, "Allow", "/GET/projects/" + id + "/*");
                }
            }

            callback(null, policy);
            break;
        default:
            callback(null, failure({status: false, body: "Unauthorized"}));
    }
}