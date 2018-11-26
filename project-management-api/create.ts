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
<<<<<<< Updated upstream
            title: data.title,
            description: data.description,
            admin: data.admin,
            roles: data.roles,
            users: data.users,
=======
            title: input.title,
            description: input.description,
            projectManager: input.projectManager,
            roles: input.roles,
            users: input.users,
>>>>>>> Stashed changes
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