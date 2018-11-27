// authorizer for any users that are authenticated for basic site functionality
'use strict';
import { createPolicy, addToPolicy, denyPolicy } from "./lib/auth-policy";
import { failure } from "./lib/response";
export function main(event, context, callback) {
    if (typeof event.authorizationToken === undefined) {
        callback(failure({ status: false, body: "No AccessToken given" }));
    }
    console.log(event.authorizationToken);
    const accessToken = event.authorizationToken.split('Bearer')[1].trim();
    const decoded = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString('utf8'));
    console.log(decoded);
    switch (decoded.iss) {
        // if the user is authenticated
        case "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7DRbUQOk6":
            let policy = createPolicy(decoded.username, "Allow", "/POST/projects");
            policy = addToPolicy(policy, "Allow", "/GET/projects");
            policy = addToPolicy(policy, "Allow", "/GET/projects/*");
            policy = addToPolicy(policy, "Allow", "/GET/users");
            policy = addToPolicy(policy, "Allow", "/GET/users/list");
            policy = addToPolicy(policy, "Allow", "/PUT/users");
            console.log(policy.valueOf());
            callback(null, policy);
            break;
        default:
            callback(null, denyPolicy(decoded.username));
    }
}
//# sourceMappingURL=authorizer-default.js.map