import type { CategoryList } from "./Constants";

export type DebugFunction = (url: string, time: {
    end: number;
    start: number;
    time: number;
}) => void;
export interface Options {
    apiKey: string;
    baseURL: string;
    host: string;
    shortenerBaseURL: string;
    shortenerHost: string;
    thumbsBaseURL: string;
    thumbsHost: string;
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
    (this: void, amount?: 1, sizeLimit?: string | number): Promise<JSONResponse>;
    (this: void, amount: 2 | 3 | 4 | 5, sizeLimit?: string | number): Promise<Array<JSONResponse>>;
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


export type StringCategories = typeof CategoryList[number];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type StringToNestedObject<S extends string, K> = S extends `${infer T}.${infer U}` ? {[Key in T]: StringToNestedObject<U, K>} : { [Key in S]: K };
export type ImagesStructure = UnionToIntersection<StringToNestedObject<StringCategories, APIFunction>>;
