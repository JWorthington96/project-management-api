// Helper function to construct a Policy Document JSON
export function createPolicy(adminId, projectId, deleteBool = false, getBool = false, putBool = false, updateBool = false) {
    let actions = [];
    deleteBool ? actions.push("dynamodb:DeleteItem") : null;
    getBool ? actions.push("dynamodb:GetItem") : null;
    putBool ? actions.push("dynamodb:PutItem") : null;
    actions.push("dynamodb:Scan");
    updateBool ? actions.push("dynamodb:UpdateItem") : null;
    const statement = [
        {
            Effect: "Allow",
            Action: "logs:CreateLogGroup",
            Resource: "*"
        },
        {
            Effect: "Allow",
            Action: actions,
            Resource: "arn:aws:dynamodb:" + adminId + ":projects/" + projectId
        }
    ];
    const policyDocument = {
        Version: "2012-10-17",
        Statement: statement
    };
    return policyDocument;
}
//# sourceMappingURL=create-policy.js.map