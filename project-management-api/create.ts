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
            name: data.name,
            description: data.description,
            createdAt: Date.now()
        }
    };

    try {
        await dynamoDb.call("put", params);
        callback(null, success(params.Item));
    } catch (error) {
        console.log(error.message);
        callback(null, failure({status: false}));
    }
}