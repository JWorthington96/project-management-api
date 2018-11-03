// library for building response objects

export function success(body) {
    return buildResponse(200, body);
}

export function failure(body) {
    return buildResponse(500, body);
}

function buildResponse(statusCode: number, body) {
    return {
        statusCode: statusCode,
        // enabling CORS
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(body)
    };
}