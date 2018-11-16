import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const data = JSON.parse(event.body);
    const params = {
        TableName: "projects",
        Key: {
            adminId: event.requestContext.identity.cognitoIdentityId,
            projectId: event.pathParameters.id,
        },
        UpdateExpression: "SET title = :title, description = :description, roles = :roles, admin = :admin," +
            "users = :users",
        ExpressionAttributeValues: {
            ":title": data.title ? data.title : null,
            ":description": data.description ? data.description : null,
            ":admin": data.admin ? data.admin : null,
            ":roles": data.roles ? data.roles : null,
            ":users": data.users ? data.users : null
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        call('update', params);
        callback(null , success({status: true}));
    } catch (error) {
        console.error(error);
        callback(null, failure({status: false}));
    }
}