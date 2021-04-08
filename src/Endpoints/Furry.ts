import { USER_AGENT, API_URL, API_VERSION, API_HEADERS, API_HOST } from "../util/Constants";
import { FurryEndpoints, ImageResponse, JSONResponse, Options, f } from "../util/types";
import ErrorHandler from "../util/ErrorHandler";
import YIFF from "./Yiff";
import { performance } from "perf_hooks";
import get from "../util/get";

export default class Furry {
	options: Options;
	private _yiff: YIFF;
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

	private async sendRequest(cat: FurryEndpoints, method: "image"): Promise<ImageResponse>;
	private async sendRequest(cat: FurryEndpoints, method: "json", amount: 1, maxImageSize?: string): Promise<JSONResponse>;
	private async sendRequest(cat: FurryEndpoints, method: "json", amount?: 2 | 3 | 4 | 5, maxImageSize?: string): Promise<JSONResponse[]>;
	private async sendRequest(cat: FurryEndpoints, method?: "image" | "json", amount?: 1 | 2 | 3 | 4 | 5, maxImageSize?: string): Promise<JSONResponse[] | JSONResponse | ImageResponse> {
		if (!cat) throw new TypeError("missing category");
		if (!method) method = "json";
		method = method.toLowerCase() as any;
		if (["image"].includes(method!) && amount && amount > 1) throw new TypeError("Ammount cannot be greater than one when requesting an image or stream.");
		if (amount === undefined) amount = 1;
		if (amount && amount > 5) throw new TypeError("Amount cannot be greater than five.");

		switch (method) {
			case "image": {
				const start = performance.now();
				const r = await get(`${this.options.baseURL}/${API_VERSION}/furry/${cat}/image?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, this.options.userAgent, this.options.apiKey);
				const end = performance.now();

				if (r.statusCode !== 200) {
					let v: { error: string } | string;
					try {
						v = JSON.parse(r.body.toString());
					} catch(e) {
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

				Object.keys(r.headers).map((h: string) => {
					if (Object.values(API_HEADERS).includes(h[0])) {
						const n = Object.keys(API_HEADERS)[Object.values(API_HEADERS).indexOf(h)];
						if ((d as any)[n] instanceof Array) (d as any)[n].push(r.headers[h]);
						else if (typeof (d as any)[n] === "number") (d as any)[n] = Number(r.headers[h]);
						else (d as any)[n] = r.headers[h];
					}
				});

				this.debug(`${this.options.baseURL}/${API_VERSION}/furry/${cat}/image?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, { start, end, time: parseFloat((end - start).toFixed(2)) });

				return {
					image: r.body,
					data: d
				} as any as ImageResponse;
				break;
			}

			case "json": {
				const start = performance.now();
				const r = await get(`${this.options.baseURL}/${API_VERSION}/furry/${cat}?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, this.options.userAgent, this.options.apiKey);

				const end = performance.now();

				if (r.statusCode !== 200) {
					let v: { error: string } | string;
					try {
						v = JSON.parse(r.body.toString());
					} catch(e) {
						v = r.body.toString();
					}
					const e = ErrorHandler(r.statusCode);
					if (!e) throw new TypeError(`Non 200-OK status code returned from api: ${r.statusCode} ${r.statusMessage} (${typeof v === "string" ? v : v.error})`);
					else throw new TypeError(e);
				}

				let b;
				try {
					b = JSON.parse(r.body.toString());
				} catch (e) {
					throw new TypeError(`Error parsing JSON body: ${e.stack}`);
				}

				this.debug(`${this.options.baseURL}/${API_VERSION}/furry/${cat}?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, { start, end, time: parseFloat((end - start).toFixed(2)) });

				return amount === 1 ? b.images[0] as JSONResponse : b.images as JSONResponse[];
				break;
			}

			default: throw new TypeError(`Unknown method "${method}"`);
		}
	}

	get boop() { return this.sendRequest.bind(this, "boop") as typeof f; }
	get cuddle() { return this.sendRequest.bind(this, "cuddle") as typeof f; }
	get flop() { return this.sendRequest.bind(this, "flop") as typeof f; }
	get fursuit() { return this.sendRequest.bind(this, "fursuit") as typeof f; }
	get hold() { return this.sendRequest.bind(this, "hold") as typeof f; }
	get howl() { return this.sendRequest.bind(this, "howl") as typeof f; }
	get hug() { return this.sendRequest.bind(this, "hug") as typeof f; }
	get kiss() { return this.sendRequest.bind(this, "kiss") as typeof f; }
	get lick() { return this.sendRequest.bind(this, "lick") as typeof f; }
	get propose() { return this.sendRequest.bind(this, "propose") as typeof f; }
	get butts() { return this.sendRequest.bind(this, "butts") as typeof f; }
	get bulge() { return this.sendRequest.bind(this, "bulge") as typeof f; }
	get yiff() { return this._yiff || (this._yiff = new YIFF(this.options)); }

	private get debug() { return this.options.debug; }
}
