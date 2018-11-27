// Helper function to generate the policies used by the authorizers

// Resource needs a leading slash, effect is either "Allow" or "Deny"
export function createPolicy(principalId, effect, resource) {
    const response = {};
    response["principalId"] = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument["Version"] = '2012-10-17';
        policyDocument["Statement"] = [];
        const statement = {};
        statement["Action"] = 'execute-api:Invoke';
        statement["Effect"] = effect;
        statement["Resource"] = "arn:aws:execute-api:eu-west-2:401633837556:z8ogont2v6/*" + resource;
        policyDocument["Statement"][0] = statement;
        response["policyDocument"] = policyDocument;
    }
    return response;
}

export function addToPolicy(policy, effect, resource) {
    const newPolicy = policy;
    if (effect && resource) {
        const statement = {};
        statement["Action"] = 'execute-api:Invoke';
        statement["Effect"] = effect;
        statement["Resource"] = "arn:aws:execute-api:eu-west-2:401633837556:z8ogont2v6/*" + resource;
        newPolicy["policyDocument"]["Statement"].push(statement);
    }
    console.log(newPolicy);
    return newPolicy;
}

// Denies all resources
export function denyPolicy(principalId) {
    return createPolicy(principalId, "Deny", "/*");
}