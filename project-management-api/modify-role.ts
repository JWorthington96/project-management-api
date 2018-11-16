import {call} from "./lib/iam";
import {success, failure} from "./lib/response";
import {createPolicy} from "./lib/create-policy";

export async function main(event, context, callback){
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
        RoleName: event.RoleName
    };
    const roleParams = {
        RoleName: event.RoleName,
        Description: event.Description
    };

    try {
        await call('putRolePolicy', policyParams);
        await call('updateRole', roleParams);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error.message}))
    }
}