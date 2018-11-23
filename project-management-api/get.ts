import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const params = {
        TableName: "projects",
        Key: {
            adminId: event.requestContext.identity.cognitoIdentityId,
            projectId: event.pathParameters.id
        }
    };

    try {
        const response = await call("get", params);
        if (response.Item) {
            callback(null, success(response.Item));
        } else {
            callback(null, failure({status: false, error: "Item not found."}));
        }
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}