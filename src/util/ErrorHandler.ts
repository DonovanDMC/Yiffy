
export default ((code: number) => {
	switch (code) {
		case 400: return "400 Bad Request, make sure you made the request right, because something was malformed.";
		case 401: return "401 Unauthorized, if authorization was required, make sure you provided it.";
		case 403: return "403 Forbidden, you do not have permission to access whatever you were trying to access.";
		case 404: return "404 Not Found, make sure you are trying the right endpoint. Check the documentation, it may have changed.";
		case 405: return "405 Method Not Allowed, make sure you are using the right method, the server does not allow whatever method you tried to use.";
		case 410: return "410 Gone, whatever you tried to fetch has been moved or deleted.";
		case 413: return "413 Payload Too Large, whatever you tried to send was too large for the server to handle.";
		case 414: return "414 Request-URI Too Long, the request url was too long for the server to handle.";
		case 415: return "415 Unsupported Media Type, the server does not support the media type you tried to use.";
		case 429: return "429 Too Many Requests, please slow down, you are being rate limited.";
		case 500: return "500 Internal Server Error, the server had an internal error, please try again later.";
		case 501: return "501 Not Implemented, whatever you tried has not been implemented at the server.";
		case 502: return "502 Bad Gateway, the server, while trying to contact a local proxy instance, failed. ";
		case 503: return "503 Service Unavailable, the service is not available, please try again later.";
		case 504: return "504 Gateway Timeout, the server, while trying to contact a local proxy instace, timed out.";
		case 505: return "505 HTTP Version Not Supported, the http version you are trying to use is not supported.";
	}
});
