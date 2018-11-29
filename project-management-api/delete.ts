import * as dynamoDb from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    let projectStatus = "pending" || "active" || "completed";
    if (event.queryStringParameters) projectStatus = event.queryStringParameters.projectStatus;

    const params = {
        TableName: "projects",
        Key: {
            projectId: event.pathParameters.id,
            projectStatus: projectStatus
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