import YIFF from "./Yiff";
import { USER_AGENT, API_URL, API_HEADERS, API_HOST } from "../util/Constants";
import type {
    f,
    FurryEndpoints,
    ImageResponse,
    JSONResponse,
    Options
} from "../util/types";
import ErrorHandler from "../util/ErrorHandler";
import get from "../util/get";
import { performance } from "node:perf_hooks";

export default class Furry {
    private _yiff: YIFF;
    options: Options;
    constructor(d?: Partial<Options>) {
        if (!d) {
            d = {};
        }
        this.options = {
            userAgent: d.userAgent || USER_AGENT,
            apiKey:    d.apiKey || "",
            debug:     d.debug || (() => null),
            baseURL:   d.baseURL || API_URL,
            host:      d.host || API_HOST
        };
    }
    private async sendRequest(cat: FurryEndpoints, method?: "image" | "json", amount?: 1 | 2 | 3 | 4 | 5, maxImageSize?: string): Promise<Array<JSONResponse> | JSONResponse | ImageResponse> {
        if (!cat) {
            throw new TypeError("missing category");
        }
        if (!method) {
            method = "json";
        }
        method = method.toLowerCase() as typeof method;
        if (method === "json" && amount === undefined) {
            amount = 1;
        }
        if (["image"].includes(method) && amount && amount > 1) {
            throw new TypeError("Ammount cannot be greater than one when requesting an image.");
        }
        if (amount === undefined) {
            amount = 1;
        }
        if (amount && amount > 5) {
            throw new TypeError("Amount cannot be greater than five.");
        }

        switch (method) {
            case "image": {
                const start = performance.now();
                const r = await get(`${this.options.baseURL}/furry/${cat}/image?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, this.options.userAgent, this.options.apiKey);
                const end = performance.now();

                if (r.statusCode !== 200) {
                    let v: { error: string; } | string;
                    try {
                        v = JSON.parse(r.body.toString()) as typeof v;
                    } catch {
                        v = r.body.toString();
                    }
                    const e = ErrorHandler(r.statusCode);
                    const error = !e ? new TypeError(`Non 200-OK status code returned from api: ${r.statusCode} ${r.statusMessage} (${typeof v === "string" ? v : v.error})`) : new TypeError(e);
                    throw error;
                }

                const d = {
                    artists:   [],
                    sources:   [],
                    width:     0,
                    height:    0,
                    url:       "",
                    shortURL:  "",
                    reportURL: "",
                    type:      "",
                    name:      "",
                    ext:       "",
                    size:      0
                } as JSONResponse;

                // I'm not sure if the any spam or this is better,
                // both are type abuse
                Object.keys(r.headers).map((hr: string) => {
                    if (Object.values(API_HEADERS).includes(hr[0])) {
                        const n = Object.keys(API_HEADERS)[Object.values(API_HEADERS).indexOf(hr)] as "artists" | "sources";
                        if (Array.isArray(d[n])) {
                            d[n].push(...(Array.isArray(r.headers[hr]) ? r.headers[hr] : [r.headers[hr] as string]));
                        } else if (typeof d[n] === "number") {
                            d[n] = Number(r.headers[hr]) as unknown as Array<string>;
                        } else {
                            d[n] = r.headers[hr] as Array<string>;
                        }
                    }
                });

                this.debug(`${this.options.baseURL}/furry/${cat}/image?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, { start, end, time: parseFloat((end - start).toFixed(2)) });

                return {
                    image: r.body,
                    data:  d
                } as unknown as ImageResponse;
            }

            case "json": {
                const start = performance.now();
                const r = await get(`${this.options.baseURL}/furry/${cat}?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, this.options.userAgent, this.options.apiKey);

                const end = performance.now();

                if (r.statusCode !== 200) {
                    let v: { error: string; } | string;
                    try {
                        v = JSON.parse(r.body.toString()) as typeof v;
                    } catch {
                        v = r.body.toString();
                    }
                    const e = ErrorHandler(r.statusCode);
                    const error = !e ? new TypeError(`Non 200-OK status code returned from api: ${r.statusCode} ${r.statusMessage} (${typeof v === "string" ? v : v.error})`) : new TypeError(e);
                    throw error;
                }

                let b: { images: Array<JSONResponse>;};
                try {
                    b = JSON.parse(r.body.toString()) as typeof b;
                } catch (e) {
                    throw new TypeError(`Error parsing JSON body: ${(e as Error).stack!}`);
                }

                this.debug(`${this.options.baseURL}/furry/${cat}?notes=disabled${maxImageSize ? `&sizeLimit=${maxImageSize}` : ""}`, { start, end, time: parseFloat((end - start).toFixed(2)) });

                return amount === 1 ? b.images[0]  : b.images ;
            }

            default: {
                throw new TypeError(`Unknown method "${method as string}"`);
            }
        }
    }

    private get debug() {
        return this.options.debug;
    }

    get boop() {
        return this.sendRequest.bind(this, "boop") as typeof f;
    }
    get bulge() {
        return this.sendRequest.bind(this, "bulge") as typeof f;
    }
    get butts() {
        return this.sendRequest.bind(this, "butts") as typeof f;
    }
    get cuddle() {
        return this.sendRequest.bind(this, "cuddle") as typeof f;
    }
    get flop() {
        return this.sendRequest.bind(this, "flop") as typeof f;
    }
    get fursuit() {
        return this.sendRequest.bind(this, "fursuit") as typeof f;
    }
    get hold() {
        return this.sendRequest.bind(this, "hold") as typeof f;
    }
    get howl() {
        return this.sendRequest.bind(this, "howl") as typeof f;
    }
    get hug() {
        return this.sendRequest.bind(this, "hug") as typeof f;
    }
    get kiss() {
        return this.sendRequest.bind(this, "kiss") as typeof f;
    }
    get lick() {
        return this.sendRequest.bind(this, "lick") as typeof f;
    }
    get propose() {
        return this.sendRequest.bind(this, "propose") as typeof f;
    }
    get yiff() {
        return this._yiff || (this._yiff = new YIFF(this.options));
    }
}
