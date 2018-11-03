import uuid from "uuid/v1";
import * as dynamoDb from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "projects",
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            projectId: uuid(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now()
        }
    };

    try {
        await dynamoDb.call("put", params);
        callback(null, success(params.Item));
    } catch (e) {
        console.log(e);
        callback(null, failure({status: false}));
    }
}