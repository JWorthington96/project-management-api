import * as dynamoDb from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
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
        const result = await dynamoDb.call("query", params);
        // Return the matching list of items in the response body
        callback(null, success(result.Items));
    } catch (e) {
        callback(null, failure({status: false}));
    }
}