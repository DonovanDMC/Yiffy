export type YiffEndpoints = "andromorph" | "gynomorph" | "gay" | "lesbian" | "straight";
export type FurryEndpoints = "boop" | "cuddle" | "flop" | "fursuit" | "hold" | "howl" | "hug" | "kiss" | "lick" | "propose" | "butts" | "bulge";
export type AnimalEndpoints = "birb" | "blep" | "cheeta" | "dikdik" | "fox" | "lynx" | "wolf";

export function f(method: "image"): Promise<ImageResponse>;
export function f(method: "json", amount: 2 | 3 | 4 | 5, maxImageSize?: string): Promise<Array<JSONResponse>>;
export function f(method?: "json", amount?: 1, maxImageSize?: string): Promise<JSONResponse>;

export type DebugFunction = (url: string, time: {
    end: number;
    start: number;
    time: number;
}) => void;
export interface Options {
    apiKey: string;
    baseURL: string;
    debug: DebugFunction;
    host: string;
    userAgent: string;
}

export interface JSONResponse {
    artists: Array<string>;
    ext: string;
    height: number;
    name: string;
    reportURL: string;
    shortURL: string;
    size: number;
    sources: Array<string>;
    type: string;
    url: string;
    width: number;
}

export interface ImageResponse {
    data: JSONResponse;
    image: Buffer;
}
