import {call} from "./lib/dynamodb";
import {success, failure} from "./lib/response";

export async function main(event, context, callback){
    const params = {
        TableName: "projects"
    };

    try {
        const response = await call('scan', params);
        callback(null, success(response.Items));
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error}));
    }
}