import {call} from "./lib/iam";
import {success, failure} from "./lib/response";
import {createPolicy} from "./lib/create-policy";

export async function main(event, context, callback){
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
        RoleName: input.RoleName
    };
    const roleParams = {
        RoleName: input.RoleName,
        Description: input.Description
    };

    try {
        await call('putRolePolicy', policyParams);
        await call('updateRole', roleParams);
        callback(null, success({status: true}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}))
    }
}