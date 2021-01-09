import { USER_AGENT, API_URL, API_VERSION, API_HEADERS, API_HOST } from "../util/Constants";
import { JSONResponse, ImageResponse, YiffEndpoints, Options } from "../util/types";
import ErrorHandler from "../util/ErrorHandler";
import { performance } from "perf_hooks";
import get from "../util/get";

export default class YIFF {
	options: Options;
	constructor(d?: Partial<Options>) {
		if (!d) d = {};
		this.options = {
			userAgent: d.userAgent || USER_AGENT,
			apiKey: d.apiKey || "",
			debug: d.debug || (() => null),
			baseURL: d.baseURL || API_URL,
			host: d.host || API_HOST
		};
	}

	private async sendRequest(cat: YiffEndpoints, method: "image"): Promise<ImageResponse>;
	private async sendRequest(cat: YiffEndpoints, method: "json", amount: 1): Promise<JSONResponse>;
	private async sendRequest(cat: YiffEndpoints, method: "json", amount?: 2 | 3 | 4 | 5): Promise<JSONResponse[]>;
	private async sendRequest(cat: YiffEndpoints, method?: "image" | "json", amount?: 1 | 2 | 3 | 4 | 5): Promise<JSONResponse[] | JSONResponse | ImageResponse> {
		if (!cat) throw new TypeError("missing category");
		if (!method) method = "json";
		method = method.toLowerCase() as any;
		if (["image"].includes(method!) && amount && amount > 1) throw new TypeError("Ammount cannot be greater than one when requesting an image or stream.");
		if (amount && amount > 5) throw new TypeError("Amount cannot be greater than five.");

		const h: { Authorization?: string; } = {};
		if (this.options.apiKey) h.Authorization = this.options.apiKey;

		switch (method) {
			case "image": {
				const start = performance.now();
				const r = await get(`${this.options.baseURL}/${API_VERSION}/furry/yiff/${cat}/image`, this.options.userAgent, this.options.apiKey);
				const end = performance.now();

				if (r.statusCode !== 200) {
					const e = ErrorHandler(r.statusCode);
					if (!e) throw new TypeError(`Non 200-OK status code returned from api: ${r.statusCode} ${r.statusMessage}`);
					else throw new TypeError(e);
				}

				const d = {
					artists: [],
					sources: [],
					width: 0,
					height: 0,
					url: "",
					shortURL: "",
					reportURL: "",
					type: "",
					name: "",
					ext: ""
				} as JSONResponse;

				Object.keys(r.headers).map((h: string) => {
					if (Object.values(API_HEADERS).includes(h[0])) {
						const n = Object.keys(API_HEADERS)[Object.values(API_HEADERS).indexOf(h)];
						if ((d as any)[n] instanceof Array) (d as any)[n].push(r.headers[h]);
						else if (typeof (d as any)[n] === "number") (d as any)[n] = Number(r.headers[h]);
						else (d as any)[n] = r.headers[h];
					}
				});

				this.debug(`${this.options.baseURL}/${API_VERSION}/furry/yiff/${cat}/image`, { start, end, time: parseFloat((end - start).toFixed(2)) });

				return {
					image: r.body,
					data: d
				} as any as ImageResponse;
				break;
			}

			case "json": {
				const start = performance.now();
				const r = await get(`${this.options.baseURL}/${API_VERSION}/furry/yiff/${cat}`, this.options.userAgent, this.options.apiKey);
				const end = performance.now();

				if (r.statusCode !== 200) {
					const e = ErrorHandler(r.statusCode);
					if (!e) throw new TypeError(`Non 200-OK status code returned from api: ${r.statusCode} ${r.statusMessage}`);
					else throw new TypeError(e);
				}

				let b;
				try {
					b = JSON.parse(r.body.toString());
				} catch (e) {
					throw new TypeError(`Error parsing JSON body: ${e.stack}`);
				}

				this.debug(`${this.options.baseURL}/${API_VERSION}/furry/yiff/${cat}`, { start, end, time: parseFloat((end - start).toFixed(2)) });

				return amount === 1 ? b.images[0] as JSONResponse : b.images as JSONResponse[];
				break;
			}

			default: throw new TypeError(`Unknown method "${method}"`);
		}
	}

	get gay() { return this.sendRequest.bind(this, "gay"); }
	get gynomorph() { return this.sendRequest.bind(this, "gynomorph"); }
	get lesbian() { return this.sendRequest.bind(this, "lesbian"); }
	get straight() { return this.sendRequest.bind(this, "straight"); }

	private get debug() { return this.options.debug; }
}
