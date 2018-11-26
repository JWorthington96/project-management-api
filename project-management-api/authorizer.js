import { failure } from "./lib/response";
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
    return createPolicy(principalId, "Deny", "*");
};
export function main(event, context, callback) {
    if (typeof event.authorizationToken === 'undefined') {
        callback(null, failure({ status: false, body: "Unauthorized" }));
    }
    // decoding the payload
    const tokenBody = JSON.parse(Buffer.from(event.authorizationToken.split('.')[1], 'base64').toString('utf8'));
    console.log(tokenBody);
    let adminProjectIds = [];
    let managerProjectIds = [];
    let developerProjectIds = [];
    if (tokenBody['cognito:adminProjects'])
        adminProjectIds = tokenBody['cognito:adminProjects'].toString().split(',');
    if (tokenBody['cognito:managerProjects'])
        managerProjectIds = tokenBody['cognito:managerProjects'].toString().split(',');
    if (tokenBody['cognito:devProjects'])
        developerProjectIds = tokenBody['cognito:devProjects'].toString().split(',');
    console.log(adminProjectIds);
    console.log(managerProjectIds);
    console.log(developerProjectIds);
    switch (tokenBody.iss) {
        // if the user is authenticated
        case "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6":
            let policy = denyPolicy(tokenBody['cognito:username']);
            policy = addToPolicy(policy, "Allow", "/*/projects");
            policy = addToPolicy(policy, "Allow", "/GET/users");
            policy = addToPolicy(policy, "Allow", "/GET/users/list");
            if (adminProjectIds !== []) {
                // admins will have access to all Lambda functions in the given project
                for (let i = 0; i < adminProjectIds.length; i++) {
                    const id = adminProjectIds[i];
                    policy = addToPolicy(policy, "Allow", "/*/projects/" + id + "/*");
                }
            }
            if (managerProjectIds !== []) {
                // project managers will have access to all Lambda functions, apart from deleting the project
                for (let i = 0; i < managerProjectIds.length; i++) {
                    const id = managerProjectIds[i];
                    if (id in adminProjectIds === false) {
                        policy = addToPolicy(policy, "Allow", "/GET/projects/" + id + "/*");
                        policy = addToPolicy(policy, "Allow", "/PUT/projects/" + id + "/*");
                        policy = addToPolicy(policy, "Allow", "/POST/projects/" + id + "/*");
                        policy = addToPolicy(policy, "Allow", "/DELETE/projects/" + id + "/*");
                    }
                }
            }
            if (developerProjectIds !== []) {
                // developers will have access to all GET Lambda functions
                for (let i = 0; i < developerProjectIds.length; i++) {
                    const id = developerProjectIds[i];
                    if (id in adminProjectIds === false && id in managerProjectIds === false) {
                        policy = addToPolicy(policy, "Allow", "/GET/projects/" + id + "/*");
                    }
                }
            }
            callback(null, policy);
            break;
        default:
            callback(null, failure({ status: false, body: "Unauthorized" }));
    }
}
//# sourceMappingURL=authorizer.js.map