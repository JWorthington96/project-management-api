import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);
    const params = {
        TableName: "projects",
        Key: {
            projectId: event.pathParameters.id
        },
        UpdateExpression: "SET status = :status, title = :title, description = :description," +
            "projectManager = :projectManager, users = :users",
        ExpressionAttributeValues: {
            ":status": input.status ? input.status : null,
            ":title": input.title ? input.title : null,
            ":description": input.description ? input.description : null,
            ":projectManager": input.projectManager ? input.projectManager : null,
            ":users": input.users ? input.users : null
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