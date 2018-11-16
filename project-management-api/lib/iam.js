import AWS from "aws-sdk";
AWS.config.update({ region: "eu-west-2" });
export function call(action, params) {
    const iam = new AWS.IAM({ apiVersion: '2010-05-08' });
    return iam[action](params).promise();
}
//# sourceMappingURL=iam.js.map