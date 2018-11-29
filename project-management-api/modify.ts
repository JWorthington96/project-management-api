import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback) {
    const input = JSON.parse(event.body);

    // mapping the input to get an AttributeUpdates object
    const attributeUpdates = {};
    Object.keys(input).map( key => {
        attributeUpdates[key.toString()] = {
            "Action": "PUT",
            "Value": input[key]
        }
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
        const updated = await call('update', params);
        callback(null , success({status: true, body: updated.Attributes}));
    } catch (error) {
        console.error(error);
        callback(null, failure({status: false, body: error.message}));
    }
}