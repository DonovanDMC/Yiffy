declare namespace Yiffy {
	type YiffEndpoints = "gynomorph" | "gay" | "lesbian" | "straight";
	type FurryEndpoints = "boop" | "cuddle" | "flop" | "fursuit" | "hold" | "howl" | "hug" | "kiss" | "lick" | "propose" | "butts" | "bulge";
	type AnimalEndpoints = "birb" | "blep" | "cheeta" | "fox" | "lynx" | "wolf";

	function f(method: "image"): Promise<ImageResponse>;
	function f(method: "json", amount: 1): Promise<JSONResponse>;
	function f(method: "json", amount?: 2 | 3 | 4 | 5): Promise<JSONResponse[]>;
	function f(method?: "image" | "json", amount?: 1 | 2 | 3 | 4 | 5): Promise<ImageResponse | JSONResponse[]>;

	type DebugFunction = (url: string, time: {
		start: number;
		end: number;
		time: number;
	}) => void;
	interface Options {
		userAgent: string;
		apiKey: string;
		debug: DebugFunction;
		baseURL: string;
		host: string;
	}

	interface JSONResponse {
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

	interface ImageResponse {
		data: JSONResponse;
		image: Buffer;
	}
}

export = Yiffy;
