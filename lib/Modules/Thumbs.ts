import APIError from "../util/APIError";
import type { YiffyErrorCodes } from "../util/Constants";
import type { Options } from "../util/types";
import { Debug } from "../util/Debug";
import { fetch } from "undici";


export class ThumbCanceledError extends Error {
    override message = "cancel() was called during thumbnail generation";
    override name = "ThumbCanceledError";
}

export default class Thumbs {
    private _cancelable: Record<string, (error: boolean) => void> = {};
    private options: Options;
    constructor(options: Options) {
        this.options = options;
    }

    private async _checkUntilDone(url: string, time: number): Promise<string> {
        let canceled = false;
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, time);
            this._cancelable[url] = (error: boolean) => {
                clearTimeout(timeout);
                delete this._cancelable[url];
                if (error) {
                    reject(new ThumbCanceledError());
                } else {
                    canceled = true;
                }
            };
        }).then(() => {
            delete this._cancelable[url];
        });
        if (canceled) {
            return null as never;
        }
        const check = await this.check(url);
        if (check === null) {
            throw new Error("Generation Timed Out");
        }

        if (check.done) {
            return check.url;
        }

        return this._checkUntilDone(check.checkURL, check.time);
    }

    /**
     * Check an in-progress generation.
     * @param md5OrURL The MD5 or the check URL
     * @param type The type of the thumb to check
     */
    async check(md5OrURL: string, type?: "gif" | "png") {
        if (!this.options.apiKey) {
            throw new Error("An API Key is required for Thumbs#check");
        }
        const start = process.hrtime.bigint();
        const url = type ? `${this.options.thumbsBaseURL}/check/${type}/${md5OrURL}` : md5OrURL;
        const res = await fetch(url, {
            method:  "GET",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Authorization": this.options.apiKey,
                "Host":          this.options.thumbsHost
            }
        });
        const end = process.hrtime.bigint();
        Debug("request:images", `GET ${new URL(url).pathname} - ${res.status} ${res.statusText} ${Math.trunc(Number(end - start) / 1000000)}ms`);
        const body = await res.json() as { code: YiffyErrorCodes; error: string; status: "timeout" | "error"; success: false; } | { status: "done"; success: true; url: string; } | { checkAt: string; checkURL: string; startedAt: number; status: "processing"; success: true; time: number; };
        const b = body as { code: YiffyErrorCodes; error: string; success: false; };
        switch (body.status) {
            case "done": {
                return { done: true as const, url: body.url };
            }

            case "processing": {
                return { done: false as const, checkAt: body.checkAt, checkURL: body.checkURL, startedAt: body.startedAt, time: body.time };
            }

            case "error":
            case "timeout": {
                return null;
            }
        }
        // @ts-expect-error just in case
        throw new APIError(res.status, res.statusText, "GET", "thumbs", new URL(url).pathname, b.code, b.error);
    }

    /**
     * Generate a new thumb.
     * @param md5OrID The MD5 or the ID of the image to generate a thumb for
     * @param type The type of thumb to generate
     */
    async create(md5OrID: string | number, type: "gif" | "png") {
        let url: string | undefined;
        if (!this.options.apiKey) {
            throw new Error("An API Key is required for Thumbs#create");
        }

        const start = process.hrtime.bigint();
        const res = await fetch(`${this.options.thumbsBaseURL}/${md5OrID}/${type}`, {
            method:  "PUT",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Content-Type":  "application/json",
                "Authorization": this.options.apiKey,
                "Host":          this.options.thumbsHost
            }
        });
        const end = process.hrtime.bigint();
        Debug("request:images", `PUT /${md5OrID}/${type} - ${res.status} ${res.statusText} ${Math.trunc(Number(end - start) / 1000000)}ms`);
        if (res.status === 200) {
            const body = await res.json() as { status: "done"; success: true; url: string; };
            return body.url;
        }
        if (res.status === 202) {
            const body = await res.json() as { checkAt: string; checkURL: string; startedAt: number; status: "processing"; success: true; time: number; };
            const promise = this._checkUntilDone(url = body.checkURL, body.time) as Promise<string> & { cancel(error?: boolean): void; };
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Object.defineProperty(promise, "cancel", {
                configurable: false,
                enumerable:   false,
                writable:     false,
                value:        (error = true) => {
                    if (url && this._cancelable[url]) {
                        this._cancelable[url](error);
                    }
                }
            });
            return promise;
        }
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; };

        throw new APIError(res.status, res.statusText, "POST", "thumbs", "/create", body.code, body.error);
    }

    /**
     * Get a thumb.
     * @param md5OrID The MD5 or the ID of the image to delete the thumb for
     */
    async get(md5OrID: string | number) {
        if (!this.options.apiKey) {
            throw new Error("An API Key is required for Thumbs#get");
        }

        const start = process.hrtime.bigint();
        const res = await fetch(`${this.options.thumbsBaseURL}/${md5OrID}`, {
            method:  "GET",
            headers: {
                "User-Agent":    this.options.userAgent,
                "Authorization": this.options.apiKey,
                "Host":          this.options.thumbsHost
            }
        });
        const end = process.hrtime.bigint();
        Debug("request:images", `GET /${md5OrID} - ${res.status} ${res.statusText} ${Math.trunc(Number(end - start) / 1000000)}ms`);
        const body = await res.json() as { code: YiffyErrorCodes; error: string; success: false; } | { gifURL: string; pngURL: string; success: true; };
        if (!body.success) {
            throw new APIError(res.status, res.statusText, "GET", "thumbs", `/${md5OrID}`, body.code, body.error);
        }
        return { gif: body.gifURL, png: body.pngURL };
    }
}
