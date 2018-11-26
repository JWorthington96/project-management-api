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