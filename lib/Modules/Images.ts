import type {
    BasicImageCategory,
    ImageCategory,
    JSONResponse,
    Methods,
    Options
} from "../util/types";
import { YiffyErrorCodes } from "../util/Constants";
import APIError from "../util/APIError";
import { Debug } from "../util/Debug";
import { fetch } from "undici";

function CreateImagesWrapper(doRequest: (path: string, amount?: number, sizeLimit?: string | number) => unknown, props: Array<string> = []): Methods {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Proxy(function() {}, {
        get(target, key) {
            if (typeof key !== "string") {
                throw new TypeError(`Expected key to be a string, got ${typeof key}`);
            }
            return CreateImagesWrapper(doRequest, [...props, key]);
        },
        apply(target, thisArg, args: [number?, (string | number)?]) {
            return doRequest.call(thisArg, `/${props.join("/")}`, args[0]);
        }
    }) as unknown as Methods;
}

export default class Images {
    private options: Options;
    private wrapper: Methods;
    constructor(options: Options) {
        this.options = options;
        this.wrapper = CreateImagesWrapper(this.requestImages.bind(this));
    }

    private async requestImages(path: string, amount = 1, sizeLimit?: string | number) {
        const start = process.hrtime.bigint();
        const res = await fetch(`${this.options.baseURL}${path}?amount=${amount}&notes=disabled${sizeLimit ? `&sizeLimit=${sizeLimit}` : ""}`, {
            method:  "GET",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Authorization": this.options.apiKey,
                "Host":          this.options.host
            }
        });
        const end = process.hrtime.bigint();
        Debug("request:images", `GET ${path}?amount=${amount}&notes=disabled${sizeLimit ? `&sizeLimit=${sizeLimit}` : ""} - ${res.status} ${res.statusText} ${Math.trunc(Number(end - start) / 1000000)}ms`);
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; } | { code: YiffyErrorCodes; error: { message: string; }; success: false; } | { images: Array<JSONResponse>; success: true; };
        if (body.success) {
            return amount === 1 ? body.images[0] : body.images;
        } else {
            throw new APIError(res.status, res.statusText, "GET", "images", `${path}?amount=${amount}&notes=disabled${sizeLimit ? `&sizeLimit=${sizeLimit}` : ""}`, body.code, typeof body.error === "string" ? body.error : body.error.message);
        }
    }

    async getCategory(category: string) {
        const start = process.hrtime.bigint();
        const res = await fetch(`${this.options.baseURL}/categories/${category}`, {
            method:  "GET",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Authorization": this.options.apiKey,
                "Host":          this.options.host
            }
        });
        const end = process.hrtime.bigint();
        Debug("request:images", `GET /categories/${category} - ${res.status} ${res.statusText} ${Math.trunc(Number(end - start) / 1000000)}ms`);
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; } | { data: ImageCategory; success: true; };
        if (!body.success) {
            if (body.code === YiffyErrorCodes.IMAGES_CATEGORY_NOT_FOUND) {
                return null;
            } else {
                throw new APIError(res.status, res.statusText, "GET", "images", `/categories/${category}`, body.code, body.error);
            }
        } else {
            return body.data;
        }
    }

    async getImage(id: string) {
        const start = process.hrtime.bigint();
        const res = await fetch(`${this.options.baseURL}/images/${id}.json`, {
            method:  "GET",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Authorization": this.options.apiKey,
                "Host":          this.options.host
            }
        });
        const end = process.hrtime.bigint();
        Debug("request:images", `GET /images/${id}.json - ${res.status} ${res.statusText} ${Math.trunc(Number(end - start) / 1000000)}ms`);
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; } | { data: JSONResponse & { category: string;}; success: true; };
        if (!body.success) {
            if (body.code === YiffyErrorCodes.IMAGES_NOT_FOUND) {
                return null;
            } else {
                throw new APIError(res.status, res.statusText, "GET", "images", `/images/${id}.json`, body.code, body.error);
            }
        } else {
            return body.data;
        }
    }

    async listCategories() {
        const res = await fetch(`${this.options.baseURL}/categories`, {
            method:  "GET",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Authorization": this.options.apiKey,
                "Host":          this.options.host
            }
        });
        return (await res.json() as { data: { disabled: Array<BasicImageCategory>; enabled: Array<BasicImageCategory>; }; success: true; }).data;
    }

    get animals() {
        return this.wrapper.animals;
    }

    get furry() {
        return this.wrapper.furry;
    }
}
