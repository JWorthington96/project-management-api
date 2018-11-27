import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
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
        const result = await call("query", params);
        // Return the matching list of items in the response body
        callback(null, success(result.Items));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}