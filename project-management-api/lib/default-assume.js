export default {
    Version: "2012-10-17",
    Statement: [{
            Effect: "Allow",
            Action: ["sts:AssumeRole"],
            Principal: {
                Service: ["dynamodb.amazonaws.com"]
            }
        }]
};
//# sourceMappingURL=default-assume.js.map