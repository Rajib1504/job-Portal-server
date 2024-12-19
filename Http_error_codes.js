// Here's a list of HTTP error codes and their meanings:

// 1xx Informational Responses
// 100 Continue: Request received, the client can continue.
// 101 Switching Protocols: Switching to a different protocol, as requested by the client.
// 102 Processing: The server is processing the request.
// 2xx Success
// 200 OK: The request succeeded.
// 201 Created: A new resource was successfully created.
// 202 Accepted: Request accepted for processing, but not completed.
// 204 No Content: Successful request, but no content to send in response.
// 3xx Redirection
// 301 Moved Permanently: Resource has been permanently moved to a new URL.
// 302 Found: Temporary redirection to a different URL.
// 304 Not Modified: Cached version of the resource is still valid.
// 4xx Client Errors
// 400 Bad Request: The request is invalid or cannot be processed.
// 401 Unauthorized: Authentication is required or has failed.
// 403 Forbidden: The server understands the request but refuses to authorize it.
// 404 Not Found: The requested resource could not be found.
// 405 Method Not Allowed: The HTTP method is not supported for the resource.
// 409 Conflict: Conflict in the request, such as duplicate data.
// 429 Too Many Requests: The user has sent too many requests in a given time.
// 5xx Server Errors
// 500 Internal Server Error: The server encountered an error.
// 501 Not Implemented: The server does not recognize the request method.
// 502 Bad Gateway: The server received an invalid response from an upstream server.
// 503 Service Unavailable: The server is temporarily unavailable (e.g., overloaded or under maintenance).
// 504 Gateway Timeout: The server did not receive a timely response from an upstream server.
