import * as iam from "./lib/iam";
import * as cognito from "./lib/cognito"
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);
    const roleParams = {
        RoleName: input.RoleName
    }

    try {
        const response = await iam.call('getRole', roleParams);

        const groupParams = {
            GroupName: input.GroupName,
            Description: input.Description,
            RoleArn: response.Role.Arn,
            UserPoolId: "eu-west-2_7DRbUQOk6"
        }

        await cognito.call('updateGroup', groupParams);
        callback(null, success({status: true}));
    } catch (error) {
        callback(null, failure({status: false, body: error.message}));
    }
}