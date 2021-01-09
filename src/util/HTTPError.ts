export default class HTTPError extends Error {
	body?: string;
	constructor(message: string, body?: string) {
		super(message);
		if (body) this.body = body;
	}
}
