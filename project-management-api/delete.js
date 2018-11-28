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
        let status = "pending" || "active" || "completed";
        if (event.queryStringParameters)
            status = event.queryStringParameters.status;
        const params = {
            TableName: "projects",
            Key: {
                projectId: event.pathParameters.id,
                status: status
            }
        };
        try {
            dynamoDb.call('delete', params);
            callback(null, success({ status: true }));
        }
        catch (error) {
            console.error(error);
            callback(null, failure({ status: false, error: error.message }));
        }
    });
}
//# sourceMappingURL=delete.js.map