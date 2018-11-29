// authorizer for projects

'use strict';
import {createPolicy, addToPolicy} from "./lib/auth-policy";
import {failure} from "./lib/response";
import * as cognito from "./lib/cognito";
import * as dynamodb from "./lib/dynamodb";

const generatePolicy = (user, projects, decodedToken) => {
    let admin = false;
    let managerProjectIds = [];
    let developerProjectIds = [];

    user.UserAttributes.map( (attribute) => {
        const {Name, Value} = attribute;
        if (Name === 'custom:admin' && Value === "true") admin = true;
    });

    projects.map( (project) => {
        const id = project.projectId;
        if (project.projectManager === user.Username) managerProjectIds.push(id);
        else if (project.developers.includes(user.Username)) developerProjectIds.push(id);
    });

    console.log(admin);
    console.log(managerProjectIds);
    console.log(developerProjectIds);

    switch (decodedToken.iss) {
        // if the user is authenticated
        case "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6":
            let policy = createPolicy(user.Username, "Allow", "/*/projects");
            policy = addToPolicy(policy, "Allow", "/GET/users");
            policy = addToPolicy(policy, "Allow", "/GET/users/list");

            if (admin) {
                // admins will have access to all Lambda functions in every project
                policy = addToPolicy(policy, "Allow", "/*/projects/*");
            }

            if (managerProjectIds !== []) {
                // project managers will have access to all Lambda functions
                for (let i = 0; i < managerProjectIds.length; i++) {
                    const id = managerProjectIds[i];
                    if (!admin) {
                        policy = addToPolicy(policy, "Allow", "/GET/projects/" + id);
                        policy = addToPolicy(policy, "Allow", "/PUT/projects/" + id);
                        policy = addToPolicy(policy, "Allow", "/POST/projects/" + id);
                        policy = addToPolicy(policy, "Allow", "/DELETE/projects/" + id);
                    }
                }
            }

            if (developerProjectIds !== []) {
                // developers will have access to all GET Lambda functions
                for (let i = 0; i < developerProjectIds.length; i++) {
                    const id = developerProjectIds[i];
                    if (!admin && id in managerProjectIds === false) {
                        policy = addToPolicy(policy, "Allow", "/GET/projects/" + id);
                    }
                }
            }

            console.log(policy);
            return policy;
        default:
            return "Unauthorized";
    }
};

export async function main(event, context, callback) {
    if (typeof event.authorizationToken === undefined) {
        callback(null, failure({status: false, body: "No AccessToken given"}));
    }

    const accessToken = event.authorizationToken.split('Bearer')[1].trim();
    const decoded = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('utf8'));
    console.log(decoded);

    const params = {
        TableName: "projects",
        // FilterExpression will search for any attributes in users with the given values
        // ExpressionAttributeValues defines the value in the conditions :userValue1 and :userValue2; retrieves any
        // project the given username is in (either as a project manager or developer)
        FilterExpression: "contains (usernames, :username)",
        ExpressionAttributeValues: {
            ":username": decoded.username
        }
    };

    try {
        const user = await cognito.call('getUser', {
            AccessToken: accessToken
        });
        console.log(user);
        const projects = await dynamodb.call('scan', params);
        console.log(projects.Items);
        const policy = generatePolicy(user, projects.Items, decoded);
        if (policy === "Unauthorized") {
            callback(policy);
        } else {
            callback(null, policy);
        }
    } catch (error) {
        console.log(error);
        callback(null, failure({status: false, body: error.message}));
    }
}