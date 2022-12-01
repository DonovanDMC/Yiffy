import APIError from "../util/APIError";
import type { CreatedShortURL, Options, ShortURL } from "../util/types";
import { YiffyErrorCodes } from "../util/Constants";
import { fetch } from "undici";

export default class Shortener {
    private options: Options;
    constructor(options: Options) {
        this.options = options;
    }

    /**
     * Shorten a url
     * @param url The URL to shorten
     * @param code The code to use for the short URL, random if not provided
     * @param credit The credit to use for the short URL, `Unknown` if not provided
     * @param editable If the short URL should be editable
     */
    async create(url: string, code?: string, credit?: string, editable?: boolean) {
        if (!this.options.apiKey) {
            throw new Error("An API Key is required for Shortener#create");
        }
        const res = await fetch(`${this.options.shortenerBaseURL}/create${typeof editable === "boolean" ? `?editable=${String(editable)}` : ""}`, {
            method:  "POST",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Content-Type":  "application/json",
                "Authorization": this.options.apiKey
            },
            body: JSON.stringify({
                url,
                code,
                credit
            })
        });
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; } | { data: CreatedShortURL; success: true; };
        if (!body.success) {
            throw new APIError(res.status, res.statusText, "POST", "shortener", "/create", body.code, body.error);
        }
        return body.data;
    }

    /**
     * Delete a short url
     * @param code The code of the short URL to delete
     * @param managementCode The management code of the short URL to delete (you get this when creating the short url)
     */
    async delete(code: string, managementCode: string) {
        if (!this.options.apiKey) {
            throw new Error("An API Key is required for Shortener#delete");
        }
        const res = await fetch(`${this.options.shortenerBaseURL}/delete`, {
            method:  "POST",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Content-Type":  "application/json",
                "Authorization": this.options.apiKey
            },
            body: JSON.stringify({
                code,
                managementCode
            })
        });
        if (res.status !== 204) {
            const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; };
            throw new APIError(res.status, res.statusText, "POST", "shortener", "/delete", body.code, body.error);
        }
    }

    /**
     * Edit a short url
     * @param code The code of the short URL to edit
     * @param managementCode The management code of the short URL to edit (you get this when creating the short url)
     * @param url The new URL to use for the short URL
     * @param credit The new credit to use for the short URL
     */
    async edit(code: string, managementCode: string, url?: string, credit?: string) {
        if (!this.options.apiKey) {
            throw new Error("An API Key is required for Shortener#edit");
        }
        const res = await fetch(`${this.options.shortenerBaseURL}/${code}`, {
            method:  "PATCH",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Content-Type":  "application/json",
                "Authorization": this.options.apiKey
            },
            body: JSON.stringify({
                managementCode,
                url,
                credit
            })
        });
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; } | { data: ShortURL; success: true; };
        if (!body.success) {
            throw new APIError(res.status, res.statusText, "PATCH", "shortener", `/${code}`, body.code, body.error);
        }
        return body.data;
    }

    /**
     * Get a short url
     * @param code The code of the short URL to get
     */
    async get(code: string) {
        if (!this.options.apiKey) {
            throw new Error("An API Key is required for Shortener#get");
        }
        const res = await fetch(`${this.options.shortenerBaseURL}/${code}.json`, {
            method:  "GET",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Authorization": this.options.apiKey
            }
        });
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; } | { data: ShortURL; success: true; };
        if (!body.success) {
            if (body.code === YiffyErrorCodes.SHORTENER_NOT_FOUND) {
                return null;
            }
            throw new APIError(res.status, res.statusText, "GET", "shortener", `/${code}.json`, body.code, body.error);
        }
        return body.data;
    }
}
