import {call} from "./lib/iam";
import {success, failure} from "./lib/response";
import {createPolicy} from "./lib/create-policy";
import defaultAssume from "./lib/default-trust-policy";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);
    const adminId = event.requestContext.identity.cognitoIdentityId;
    const projectId = event.pathParameters.id;
    const deleteBool = input.DeleteBoolean;
    const getBool = input.GetBoolean;
    const putBool = input.PutBoolean;
    const updateBool = input.UpdateBoolean;
    const policyDocument = JSON.stringify(createPolicy(adminId, projectId, deleteBool, getBool, putBool, updateBool));

    const policyParams = {
        PolicyDocument: policyDocument,
        PolicyName: input.RoleName + "Policy",
        Description: "Policy for " + input.RoleName + ":" + input.Description
    };

    const roleParams = {
        AssumeRolePolicyDocument: JSON.stringify(defaultAssume),
        RoleName: input.RoleName,
        Description: input.Description
    };

    try {
        const response = await call('createPolicy', policyParams);

        const attachParams = {
            RoleName: input.RoleName,
            PolicyArn: response.Policy.Arn
        };

        await call('createRole', roleParams);
        await call('attachRolePolicy', attachParams);

        callback(null, success({status: true}));
    } catch (error) {
        //console.error(error);
        callback(null, failure({status: false, error: error.message}));
    }
}