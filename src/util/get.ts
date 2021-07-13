import { API_HOST } from "./Constants";
import https from "https";
import { URL } from "url";

export default async function get(url: string, ua: string, auth?: string, host?: string): Promise<{
	headers: { [k: string]: string | Array<string>; };
	body: Buffer;
	statusCode: number;
	statusMessage: string;
}> {
	return new Promise((a, b) => {
		const u = new URL(url);
		https
			.get({
				host: u.host,
				path: `${u.pathname}${u.search}`,
				port: url.indexOf("https") !== -1 ? 443 : 80,
				method: "GET",
				headers: {
					"User-Agent": ua,
					"Host": host || API_HOST,
					...(auth ? ({
						Authorization: auth
					}) : ({}))
				}
			}, (res) => {
				const d: Array<Buffer> = [];

				res
					.on("data", d.push.bind(d))
					.on("error", (err) => b(err))
					.on("end", () => a({
						headers: res.headers as unknown as { [k: string]: string | Array<string>; },
						body: Buffer.concat(d),
						statusCode: res.statusCode!,
						statusMessage: res.statusMessage!
					}));
			})
			.end();
	});
}
