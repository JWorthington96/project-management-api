import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "projects",
        Key: {
            adminId: event.queryStringParameters.IdentityId,
            projectId: event.pathParameters.id,
        },
        UpdateExpression: "SET title = :title, description = :description, projectRoles = :projectRoles," +
            "projectManager = :projectManager, users = :users",
        ExpressionAttributeValues: {
            ":title": data.title ? data.title : null,
            ":description": data.description ? data.description : null,
            ":projectManager": data.projectManager ? data.projectManager : null,
            ":projectRoles": data.projectRoles ? data.projectRoles : null,
            ":users": data.users ? data.users : null
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