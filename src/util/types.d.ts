export type YiffEndpoints = "gynomorph" | "gay" | "lesbian" | "straight";
export type FurryEndpoints = "boop" | "cuddle" | "flop" | "fursuit" | "hold" | "howl" | "hug" | "kiss" | "lick" | "propose" | "butts" | "bulge";
export type AnimalEndpoints = "birb" | "blep" | "cheeta" | "fox" | "lynx" | "wolf";

export function f(method: "image"): Promise<ImageResponse>;
export function f(method: "json", amount: 1): Promise<JSONResponse>;
export function f(method: "json", amount?: 2 | 3 | 4 | 5): Promise<JSONResponse[]>;
export function f(method?: "image" | "json", amount?: 1 | 2 | 3 | 4 | 5): Promise<ImageResponse | JSONResponse[]>;

export type DebugFunction = (url: string, time: {
	start: number;
	end: number;
	time: number;
}) => void;
export interface Options {
	userAgent: string;
	apiKey: string;
	debug: DebugFunction;
	baseURL: string;
	host: string;
}

export interface JSONResponse {
	artists: string[];
	sources: string[];
	width: number;
	height: number;
	url: string;
	type: string;
	name: string;
	shortURL: string;
	reportURL: string;
	ext: string;
}

export interface ImageResponse {
	data: JSONResponse;
	image: Buffer;
}
