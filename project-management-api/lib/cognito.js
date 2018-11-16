import AmazonCognitoIdentity from "amazon-cognito-identity-js";
export function getUserPool(params) {
    return new AmazonCognitoIdentity.CognitoUserPool(params.UserPoolData);
}
export function getAttributeList(params) {
    let attributeList = [];
    params.UserAttributes.map((attribute) => attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute(attribute)));
    return attributeList;
}
export function getAuthenticationDetails(params) {
    return new AmazonCognitoIdentity.AuthenticationDetails(params.AuthenticationData);
}
export function getUser(params) {
    const userData = {
        Username: params.Username,
        Pool: this.getUserPool(params)
    };
    return new AmazonCognitoIdentity.CognitoUser(userData);
}
//# sourceMappingURL=cognito.js.map