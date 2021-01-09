import https from "https";
import URL from "url";
import { API_HOST } from "./Constants";

export default async function get(url: string, ua: string, auth?: string, host?: string): Promise<{
	headers: { [k: string]: string | string[]; };
	body: Buffer;
	statusCode: number;
	statusMessage: string;
}> {
	return new Promise((a, b) => {
		const u = URL.parse(url);
		https
			.get({
				host: u.host,
				path: u.path,
				port: url.indexOf("https") !== -1 ? 443 : 80,
				method: "GET",
				headers: {
					"User-Agent": ua,
					"Host": host || API_HOST,
					...(!!auth ? ({
						Authorization: auth
					}) : ({}))
				}
			}, (res) => {
				const d: Buffer[] = [];

				res
					.on("data", d.push.bind(d))
					.on("error", b)
					.on("end", () => a({
						headers: res.headers as any,
						body: Buffer.concat(d),
						statusCode: res.statusCode!,
						statusMessage: res.statusMessage!
					}));
			})
			.end();
	});
}
