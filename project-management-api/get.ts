import * as dynamoDb from "./lib/dynamodb";
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
        const result = await dynamoDb.call("get", params);
        if (result.Item) {
            callback(null, success(result.Item));
        } else {
            callback(null, failure({status: false, error: "Item not found."}));
        }
    } catch (e) {
        console.log(e);
        callback(null, failure({status: false}));
    }
}