var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as dynamoDb from "./lib/dynamodb";
import { success, failure } from "./lib/response";
export function main(event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            TableName: "projects",
            Key: {
                adminId: event.requestContext.identity.cognitoIdentityId,
                projectId: event.pathParameters.id
            }
        };
        try {
            const result = yield dynamoDb.call("get", params);
            if (result.Item) {
                callback(null, success(result.Item));
            }
            else {
                callback(null, failure({ status: false, error: "Item not found." }));
            }
        }
        catch (e) {
            console.log(e);
            callback(null, failure({ status: false }));
        }
    });
}
//# sourceMappingURL=get.js.map