export default {
    Version: "2012-10-17",
    Statement: [
        {
            Effect: "Allow",
            Principal: {
                Federated: "cognito-identity.amazonaws.com"
            },
            Action: [
                "sts:AssumeRole",
                "sts:AssumeRoleWithWebIdentity"
            ],
            Condition: {
                StringEquals: {
                    "cognito-identity.amazonaws.com:aud": "eu-west-2:b21c24c2-a661-4a66-9c5a-d8b51f02f3f3"
                },
                "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "authenticated"
                }
            }
        }
    ]
};
//# sourceMappingURL=default-trust-policy.js.map