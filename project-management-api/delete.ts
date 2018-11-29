import * as dynamoDb from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const params = {
        TableName: "projects",
        Key: {
            projectId: event.pathParameters.id
        }
    };

    try {
        dynamoDb.call('delete', params);
        callback(null, success({status: true}));
    } catch (error) {
        console.error(error);
        callback(null, failure({status: false, error: error.message}));
    }
}