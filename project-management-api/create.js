var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import uuid from "uuid/v1";
import * as dynamoDb from "./lib/dynamodb";
import { success, failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = JSON.parse(event.body);
        const params = {
            TableName: "projects",
            Item: {
                adminId: event.requestContext.identity.cognitoIdentityId,
                projectId: uuid(),
                name: data.name,
                description: data.description,
                admin: event.requestContext.identity.user,
                projectManager: data.projectManager,
                developers: data.developers,
                createdAt: Date.now()
            }
        };
        try {
            yield dynamoDb.call("put", params);
            callback(null, success(params.Item));
        }
        catch (error) {
            console.error(error.message);
            callback(null, failure({ status: false }));
        }
    });
}
//# sourceMappingURL=create.js.map