var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { call } from "./lib/dynamodb";
import { success, failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let projectStatus = "pending" || "active" || "completed";
        if (event.queryStringParameters)
            projectStatus = event.queryStringParameters.projectStatus;
        const input = JSON.parse(event.body);
        const params = {
            TableName: "projects",
            Key: {
                projectId: event.pathParameters.id,
                projectStatus: projectStatus
            },
            UpdateExpression: "SET projectStatus = :projectStatus, title = :title, description = :description," +
                "projectManager = :projectManager, developers = :developers, usernames = :usernames",
            ExpressionAttributeValues: {
                ":projectStatus": input.projectStatus ? input.status : null,
                ":title": input.title ? input.title : null,
                ":description": input.description ? input.description : null,
                ":projectManager": input.projectManager ? input.projectManager : null,
                ":developers": input.developers ? input.developers : null,
                ":usernames": input.usernames ? input.usernames : null
            },
            ReturnValues: "ALL_NEW"
        };
        try {
            yield call('update', params);
            callback(null, success({ status: true }));
        }
        catch (error) {
            console.error(error);
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=modify.js.map