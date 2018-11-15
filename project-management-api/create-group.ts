import * as cognito from "./lib/cognito";
import * as iam from "./lib/iam";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const roleParams = {
        RoleName: event.RoleName
    };

    try {
        const response = await iam.call('getRole', roleParams);
        const groupParams = {
            GroupName: event.GroupName,
            Description: event.Description,
            UserPoolId: "eu-west-2_QmN841UbB",
            RoleArn: response.Role.Arn
        };

        await cognito.call('createGroup', groupParams);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: event.message}));
    }
}