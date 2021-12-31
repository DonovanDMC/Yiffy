import { USER_AGENT, API_URL, API_HEADERS, API_HOST } from "../util/Constants";
import type {
	JSONResponse,
	ImageResponse,
	YiffEndpoints,
	Options,
	f
} from "../util/types";
import ErrorHandler from "../util/ErrorHandler";
import get from "../util/get";
import { performance } from "perf_hooks";

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
	private async sendRequest(cat: YiffEndpoints, method: "json", amount: 1, maxImageSize?: string): Promise<JSONResponse>;
	private async sendRequest(cat: YiffEndpoints, method: "json", amount?: 2 | 3 | 4 | 5, maxImageSize?: string): Promise<Array<JSONResponse>>;
	private async sendRequest(cat: YiffEndpoints, method?: "image" | "json", amount?: 1 | 2 | 3 | 4 | 5, maxImageSize?: string): Promise<Array<JSONResponse> | JSONResponse | ImageResponse> {
		if (!cat) throw new TypeError("missing category");
		if (!method) method = "json";
		method = method.toLowerCase() as typeof method;
		if (["image"].includes(method) && amount && amount > 1) throw new TypeError("Ammount cannot be greater than one when requesting an image or stream.");
		if (amount && amount > 5) throw new TypeError("Amount cannot be greater than five.");

		const h: { Authorization?: string; } = {};
		if (this.options.apiKey) h.Authorization = this.options.apiKey;

		switch (method) {
			case "image": {
				const start = performance.now();
				const r = await get(`${this.options.baseURL}/furry/yiff/${cat}/image?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, this.options.userAgent, this.options.apiKey);
				const end = performance.now();

				if (r.statusCode !== 200) {
					let v: { error: string; } | string;
					try {
						v = JSON.parse(r.body.toString()) as typeof v;
					} catch (e) {
						v = r.body.toString();
					}
					const e = ErrorHandler(r.statusCode);
					if (!e) throw new TypeError(`Non 200-OK status code returned from api: ${r.statusCode} ${r.statusMessage} (${typeof v === "string" ? v : v.error})`);
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
					ext: "",
					size: 0
				} as JSONResponse;

				// I'm not sure if the any spam or this is better,
				// both are type abuse
				Object.keys(r.headers).map((hr: string) => {
					if (Object.values(API_HEADERS).includes(hr[0])) {
						const n = Object.keys(API_HEADERS)[Object.values(API_HEADERS).indexOf(hr)] as "artists" | "sources";
						if (d[n] instanceof Array) d[n].push(...(Array.isArray(r.headers[hr]) ? r.headers[hr] : [r.headers[hr] as string]));
						else if (typeof d[n] === "number") d[n] = Number(r.headers[hr]) as unknown as Array<string>;
						else d[n] = r.headers[hr] as Array<string>;
					}
				});

				this.debug(`${this.options.baseURL}/furry/yiff/${cat}/image?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, { start, end, time: parseFloat((end - start).toFixed(2)) });

				return {
					image: r.body,
					data: d
				} as unknown as ImageResponse;
				break;
			}

			case "json": {
				const start = performance.now();
				const r = await get(`${this.options.baseURL}/furry/yiff/${cat}?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, this.options.userAgent, this.options.apiKey);
				const end = performance.now();

				if (r.statusCode !== 200) {
					let v: { error: string; } | string;
					try {
						v = JSON.parse(r.body.toString()) as typeof v;
					} catch (e) {
						v = r.body.toString();
					}
					const e = ErrorHandler(r.statusCode);
					if (!e) throw new TypeError(`Non 200-OK status code returned from api: ${r.statusCode} ${r.statusMessage} (${typeof v === "string" ? v : v.error})`);
					else throw new TypeError(e);
				}

				let b: { images: Array<JSONResponse>;};
				try {
					b = JSON.parse(r.body.toString()) as typeof b;
				} catch (e) {
					throw new TypeError(`Error parsing JSON body: ${(e as Error).stack!}`);
				}

				this.debug(`${this.options.baseURL}/furry/yiff/${cat}?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, { start, end, time: parseFloat((end - start).toFixed(2)) });

				return amount === 1 ? b.images[0]  : b.images ;
				break;
			}

			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			default: throw new TypeError(`Unknown method "${method}"`);
		}
	}

	get andromorph() { return this.sendRequest.bind(this, "andromorph") as typeof f; }
	get gay() { return this.sendRequest.bind(this, "gay") as typeof f; }
	get gynomorph() { return this.sendRequest.bind(this, "gynomorph") as typeof f; }
	get lesbian() { return this.sendRequest.bind(this, "lesbian") as typeof f; }
	get straight() { return this.sendRequest.bind(this, "straight") as typeof f; }

	private get debug() { return this.options.debug; }
}
