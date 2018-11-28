// authorizer for projects

'use strict';
import {createPolicy, addToPolicy} from "./lib/auth-policy";
import {failure} from "./lib/response";
import {call} from "./lib/cognito";

const generatePolicy = (attributes, accessToken) => {
    let admin = false;
    let managerProjectIds = [];
    let developerProjectIds = [];
    attributes.map( (attribute) => {
        const {Name, Value} = attribute;
        if (Name === 'custom:admin' && Value === "true") admin = true;
        if (Name === 'custom:managerProjects' && Value !== undefined) managerProjectIds = attribute.Value.split(',');
        if (Name === 'custom:devProjects' && Value !== undefined) developerProjectIds = attribute.Value.split(',');
    });
    console.log(admin);
    console.log(managerProjectIds);
    console.log(developerProjectIds);

    switch (accessToken.iss) {
        // if the user is authenticated
        case "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6":
            let policy = createPolicy(accessToken['username'], "Allow", "/*/projects");
            policy = addToPolicy(policy, "Allow", "/GET/users");
            policy = addToPolicy(policy, "Allow", "/GET/users/list");

            if (admin) {
                // admins will have access to all Lambda functions in every project
                policy = addToPolicy(policy, "Allow", "/*/projects/*/*");
            }

            if (managerProjectIds !== []) {
                // project managers will have access to all Lambda functions
                for (let i = 0; i < managerProjectIds.length; i++) {
                    const id = managerProjectIds[i];
                    if (!admin) {
                        policy = addToPolicy(policy, "Allow", "/GET/projects/" + id + "/*");
                        policy = addToPolicy(policy, "Allow", "/PUT/projects/" + id + "/*");
                        policy = addToPolicy(policy, "Allow", "/POST/projects/" + id + "/*");
                        policy = addToPolicy(policy, "Allow", "/DELETE/projects/" + id + "/*");
                    }
                }
            }

            if (developerProjectIds !== []) {
                // developers will have access to all GET Lambda functions
                for (let i = 0; i < developerProjectIds.length; i++) {
                    const id = developerProjectIds[i];
                    if (!admin && id in managerProjectIds === false) {
                        policy = addToPolicy(policy, "Allow", "/GET/projects/" + id + "/*");
                    }
                }
            }

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
    console.log(accessToken);

    try {
        const user = await call('getUser', {AccessToken: accessToken});
        console.log(user);
        const policy = generatePolicy(user.UserAttributes, accessToken);
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