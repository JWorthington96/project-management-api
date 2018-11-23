import * as cognito from "./lib/cognito";
import * as iam from "./lib/iam";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const input = JSON.parse(event.body);
    const roleParams = {
        RoleName: input.RoleName
    };

    try {
        const response = await iam.call('getRole', roleParams);
        const groupParams = {
            GroupName: input.GroupName,
            Description: input.Description,
            UserPoolId: "eu-west-2_7DRbUQOk6",
            RoleArn: response.Role.Arn
        };

        await cognito.call('createGroup', groupParams);
        callback(null, success({status: true}));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}