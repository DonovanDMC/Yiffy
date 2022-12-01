
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
    shortenerBaseURL: string;
    thumbsBaseURL: string;
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


export interface APIFunction {
    (amount?: 1, sizeLimit?: string | number): Promise<JSONResponse>;
    (amount: 2 | 3 | 4 | 5, sizeLimit?: string | number): Promise<Array<JSONResponse>>;
}

export interface Methods {
    animals: {
        birb: APIFunction;
        blep: APIFunction;
        dikdik: APIFunction;
    };
    furry: {
        boop: APIFunction;
        bulge: APIFunction;
        cuddle: APIFunction;
        flop: APIFunction;
        fursuit: APIFunction;
        hold: APIFunction;
        howl: APIFunction;
        hug: APIFunction;
        kiss: APIFunction;
        lick: APIFunction;
        propose: APIFunction;
        yiff: {
            andromorph: APIFunction;
            gay: APIFunction;
            gynomorph: APIFunction;
            lesbian: APIFunction;
            straight: APIFunction;
        };
    };
}

export interface BasicImageCategory {
    _comment?: string;
    db: string;
    name: string;
}

export interface ImageCategory {
    _comment?: string;
    db: string;
    dir: string;
    disabled: boolean;
    files: {
        exists: boolean;
        list: {
            average: number;
            averageM: number;
            total: number;
            totalM: number;
        };
        types: {
            "image/gif"?: number;
            "image/jpeg"?: number;
            "image/png"?: number;
        };
    };
    name: string;
}

export interface ShortURL {
    code: string;
    createdAt: string;
    credit: number;
    fullURL: string;
    modifiedAt: string;
    pos: number;
    url: string;
}

export interface CreatedShortURL extends ShortURL {
    managementCode: string | null;
}
