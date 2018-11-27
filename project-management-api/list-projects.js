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
            // FilterExpression will search for any attributes in users with the given values
            // ExpressionAttributeValues defines the value in the conditions :userValue1 and :userValue2; retrieves any
            // project the given username is in (either as a project manager or developer)
            FilterExpression: "contains (users, :userValue1) OR (users, :userValue2)",
            ExpressionAttributeValues: {
                ":userValue1": {
                    "username": event.queryStringParameters.username,
                    "role": "Project Manager"
                },
                ":userValue2": {
                    "username": event.queryStringParameters.username,
                    "role": "Developer"
                }
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