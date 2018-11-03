import uuid from 'uuid/v1';
import AWS from 'aws-sdk';

AWS.config.update({region: 'eu-west-2'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: 'projects',
        Item: {
            // Using the cognito identity ID as the user ID
            userId: event.requestContext.identity.cognitoIdentityId,
            // Creating a unique uuid using uuid v1 (based on timestamp)
            projectId: uuid(),
            // Parsed from request body
            content: data.content,
            attachment: data.attachment,
            // Current Unix timestamp
            createdAt: Date.now()
        }
    };

    dynamoDb.put(params, (err, data) => {
        // handing the error
        if (err) {
            const response = {
                // HTTP status code 500 (generic)
                statusCode: 500,
                body: JSON.stringify({status: false})
            };
            callback(null, response);
            return;
        }

        const response = {
            // HTTP status code 200 (OK)
            statusCode: 200,
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
    });
}