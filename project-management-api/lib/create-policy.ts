// Helper function to construct a Policy Document JSON
export function createPolicy(adminId: string, projectId: string,
                             deleteBool: boolean = false, getBool: boolean = false,
                             putBool: boolean = false, updateBool: boolean = false) {
    let actions = [];

    deleteBool ? actions.push("dynamodb:DeleteItem") : null;
    if(getBool) {
        actions.push("dynamodb:GetItem");
        actions.push("dynamodb:Query")
    }
    putBool ? actions.push("dynamodb:PutItem") : null;
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