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
        body: JSON.stringify(body)
    };
}