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
        const input = JSON.parse(event.body);
        // mapping the input to get an AttributeUpdates object
        const attributeUpdates = {};
        Object.keys(input).map(key => {
            attributeUpdates[key.toString()] = {
                "Action": "PUT",
                "Value": input[key]
            };
        });
        console.log(attributeUpdates);
        const params = {
            TableName: "projects",
            Key: {
                projectId: event.pathParameters.id
            },
            AttributeUpdates: attributeUpdates,
            ReturnValues: "UPDATED_NEW"
        };
        try {
            const updated = yield call('update', params);
            callback(null, success({ status: true, body: updated.Attributes }));
        }
        catch (error) {
            console.error(error);
            callback(null, failure({ status: false, body: error.message }));
        }
    });
}
//# sourceMappingURL=modify.js.map