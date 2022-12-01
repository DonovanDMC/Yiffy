import { YiffyErrorCodes } from "./Constants";

export default class APIError extends Error {
    code?: YiffyErrorCodes;
    method: string;
    override name = "APIError";
    path: string;
    rawMessage?: string;
    service: "images" | "thumbs" | "shortener";
    statusCode: number;
    statusText: string;
    constructor(statusCode: number, statusText: string, method: string, service: APIError["service"], path: string, code?: YiffyErrorCodes, message?: string) {
        super(`Unexpected ${statusCode} ${statusText} on ${method} ${path}${code || message ? ": " : ""}${message && `${message} ` || ""}${code ? `${!message ? `${YiffyErrorCodes[code]} ` : ""}(${code})` : ""}`);
        this.code = code;
        this.method = method;
        this.service = service;
        this.path = path;
        this.rawMessage = message;
        this.statusCode = statusCode;
        this.statusText = statusText;
    }
}
