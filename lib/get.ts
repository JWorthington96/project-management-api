import * as dynanoDb from "./dynamodb";
import {success, failure} from "./response";
import {fail} from "assert";

export async function main(event, context, callback) {
    const params = {
        TableName: "projects",
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            projectId: event.pathParameters.id
        }
    };

    try {
        const result = await dynanoDb.call("get", params);
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