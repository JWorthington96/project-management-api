import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const params = {
        TableName: "projects",
        // KeyConditionExpression defines the condition for the query 'adminId = :identity'; only returns items with
        // matching adminId keys
        // ExpressionAttributeValues defines the value in the condition 'adminId = :adminId'; defines
        // adminId to be Identity Pool identity id of the authenticated user
        KeyConditionExpression: "adminId = :adminId",
        ExpressionAttributeValues: {
            ":adminId": event.queryStringParameters.IdentityId
        }
    };

    try {
        const result = await call("query", params);
        // Return the matching list of items in the response body
        callback(null, success(result.Items));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}