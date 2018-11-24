import uuid from "uuid/v1";
import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);
    const params = {
        TableName: "projects",
        Item: {
            adminId: input.identityId,
            projectId: uuid(),
            title: input.title,
            description: input.description,
            projectManager: input.projectManger,
            roles: input.roles,
            users: input.users,
            createdAt: Date.now()
        }
    };

    try {
        await call("put", params);
        callback(null, success(params.Item));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}