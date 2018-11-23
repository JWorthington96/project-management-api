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
        const params = {
            TableName: "projects",
            // KeyConditionExpression defines the condition for the query 'userId = :userId'; only returns items with
            // matching userId keys
            // ExpressionAttributeValues defines the value in the condition 'userId = :userId'; defines
            // userId to be Identity Pool identity id of the authenticated user
            KeyConditionExpression: "adminId = :adminId",
            ExpressionAttributeValues: {
                ":adminId": event.requestContext.identity.cognitoIdentityId
            }
        };
        try {
            const result = yield call("query", params);
            // Return the matching list of items in the response body
            callback(null, success(result.Items));
        }
        catch (error) {
            console.log(error);
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=list-projects.js.map