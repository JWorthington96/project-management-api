var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import uuid from "uuid/v1";
import * as dynamoDb from "./dynamodb";
import { success, failure } from "./response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = JSON.parse(event.body);
        const params = {
            TableName: "projects",
            Item: {
                userId: event.requestContext.identity.cognitoIdentityId,
                projectId: uuid(),
                content: data.content,
                attachment: data.attachment,
                createdAt: Date.now()
            }
        };
        try {
            yield dynamoDb.call("put", params);
            callback(null, success(params.Item));
        }
        catch (e) {
            console.log(e);
            callback(null, failure({ status: false }));
        }
    });
}
//# sourceMappingURL=create.js.map