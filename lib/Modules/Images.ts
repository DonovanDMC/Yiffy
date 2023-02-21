import type {
    BasicImageCategory,
    ImageCategory,
    ImagesStructure,
    JSONResponse,
    Options,
    StringCategories
} from "../util/types";
import { CategoryList, YiffyErrorCodes } from "../util/Constants";
import APIError from "../util/APIError";
import { Debug } from "../util/Debug";
import { fetch } from "undici";

function CreateImagesWrapper(doRequest: (path: string, amount?: number, sizeLimit?: string | number) => unknown, props: Array<string> = []): ImagesStructure {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Proxy(function() {}, {
        get(target, key) {
            if (typeof key !== "string") {
                throw new TypeError(`Expected key to be a string, got ${typeof key}`);
            }
            const k = [...props, key].join(".") as StringCategories;

            if (CategoryList.includes(k)) {
                return (...args: [number?, (string | number)?]) => doRequest(`/${[...props, key].join("/")}`, args[0]);
            }
            if (CategoryList.some(category => category.startsWith(k))) {
                return CreateImagesWrapper(doRequest, [...props, key]);
            }
        }
    }) as unknown as ImagesStructure;
}

export default class Images {
    private options: Options;
    private wrapper: ImagesStructure;
    constructor(options: Options) {
        this.options = options;
        this.wrapper = CreateImagesWrapper(this.requestImages.bind(this));
    }

    get animals() {
        return this.wrapper.animals;
    }

    get furry() {
        return this.wrapper.furry;
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

    /**
     * Bulk fetch images. This requires both an api key, and special access from a developer. By default, a maximum of 100 images can be fetched per request.
     * @param map A map of category to the amount of images to fetch.
     */
    async getBulk(map: Partial<Record<StringCategories, number>>) {
        const start = process.hrtime.bigint();
        const res = await fetch(`${this.options.baseURL}/bulk`, {
            method:  "POST",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Authorization": this.options.apiKey,
                "Host":          this.options.host,
                "Content-Type":  "application/json"
            },
            body: JSON.stringify(map)
        });
        const end = process.hrtime.bigint();
        Debug("request:images", `POST /bulk - ${res.status} ${res.statusText} ${Math.trunc(Number(end - start) / 1000000)}ms`);
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; } | { data: Record<StringCategories, Array<JSONResponse>>; success: true; };
        if (body.success) {
            return body.data;
        } else {
            throw new APIError(res.status, res.statusText, "POST", "images", "/bulk", body.code, body.error);
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
        if (body.success) {
            return body.data;
        } else {
            if (body.code === YiffyErrorCodes.IMAGES_CATEGORY_NOT_FOUND) {
                return null;
            } else {
                throw new APIError(res.status, res.statusText, "GET", "images", `/categories/${category}`, body.code, body.error);
            }
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
        if (body.success) {
            return body.data;
        } else {
            if (body.code === YiffyErrorCodes.IMAGES_NOT_FOUND) {
                return null;
            } else {
                throw new APIError(res.status, res.statusText, "GET", "images", `/images/${id}.json`, body.code, body.error);
            }
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
}
