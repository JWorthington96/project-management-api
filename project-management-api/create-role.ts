import {call} from "./lib/iam";
import {success, failure} from "./lib/response";
import {createPolicy} from "./lib/create-policy";
import defaultAssume from "./lib/default-assume";

export async function main(event, context, callback) {
    const adminId = event.requestContext.identity.cognitoIdentityId;
    const projectId = event.pathParameters.id;
    const deleteBool = event.DeleteBoolean;
    const getBool = event.GetBoolean;
    const putBool = event.PutBoolean;
    const updateBool = event.UpdateBoolean;
    const policyDocument = JSON.stringify(createPolicy(adminId, projectId, deleteBool, getBool, putBool, updateBool));

    const policyParams = {
        PolicyDocument: policyDocument,
        PolicyName: event.RoleName + "Policy",
        Description: "Policy for " + event.RoleName + ":" + event.Description
    };

    const roleParams = {
        AssumeRolePolicyDocument: JSON.stringify(defaultAssume),
        RoleName: event.RoleName,
        Description: event.Description
    };

    try {
        const response = await call('createPolicy', policyParams);

        const attachParams = {
            RoleName: event.RoleName,
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