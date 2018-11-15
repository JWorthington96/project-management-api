import * as iam from "./lib/iam";
import * as cognito from "./lib/cognito"
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const roleParams = {
        RoleName: event.RoleName
    }

    try {
        const response = await iam.call('getRole', roleParams);

        const groupParams = {
            GroupName: event.GroupName,
            Description: event.Description,
            RoleArn: response.Role.Arn,
            UserPoolId: "eu-west-2_QmN841UbB"
        }

        await cognito.call('updateGroup', groupParams);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error.message}));
    }
}