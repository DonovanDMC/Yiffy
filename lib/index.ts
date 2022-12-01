import {
    API_HOST,
    API_URL,
    SHORTENER_URL,
    THUMBS_URL,
    USER_AGENT
} from "./util/Constants";
import type { Options } from "./util/types";
import Images from "./Modules/Images";
import Thumbs from "./Modules/Thumbs";
import Shortener from "./Modules/Shortener";

export default class Yiffy {
    private _images: Images;
    private _shortener: Shortener;
    private _thumbs: Thumbs;
    options: Options;
    constructor(d?: Partial<Options>) {
        if (!d) {
            d = {};
        }
        this.options = {
            userAgent:        d.userAgent || USER_AGENT,
            apiKey:           d.apiKey || "",
            debug:            d.debug || (() => null),
            baseURL:          d.baseURL || API_URL,
            host:             d.host || API_HOST,
            shortenerBaseURL: d.shortenerBaseURL || SHORTENER_URL,
            thumbsBaseURL:    d.thumbsBaseURL || THUMBS_URL
        };
    }

    /** @deprecated Use `images.animals` instead. */
    get animals() {
        return this.images.animals;
    }

    /** @deprecated Use `images.furry` instead. */
    get furry() {
        return this.images.furry;
    }

    get images() {
        return this._images || (this._images = new Images(this.options));
    }

    get shortener() {
        return this._shortener || (this._shortener = new Shortener(this.options));
    }

    get thumbs() {
        return this._thumbs || (this._thumbs = new Thumbs(this.options));
    }
}
