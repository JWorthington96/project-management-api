import {call} from "./lib/dynamodb";
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