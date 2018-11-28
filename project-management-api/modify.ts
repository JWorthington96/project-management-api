import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    let status = "pending" || "active" || "completed";
    if (event.queryStringParameters) status = event.queryStringParameters.status;

    const input = JSON.parse(event.body);
    const params = {
        TableName: "projects",
        Key: {
            projectId: event.pathParameters.id,
            status: status
        },
        UpdateExpression: "SET status = :status, title = :title, description = :description," +
            "projectManager = :projectManager, developers = :developers, usernames = :usernames",
        ExpressionAttributeValues: {
            ":status": input.status ? input.status : null,
            ":title": input.title ? input.title : null,
            ":description": input.description ? input.description : null,
            ":projectManager": input.projectManager ? input.projectManager : null,
            ":developers": input.developers ? input.developers : null,
            ":usernames": input.usernames ? input.usernames : null
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        await call('update', params);
        callback(null , success({status: true}));
    } catch (error) {
        console.error(error);
        callback(null, failure({status: false, body: error.message}));
    }
}