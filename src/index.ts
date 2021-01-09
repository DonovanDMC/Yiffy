import { API_HOST, API_URL, USER_AGENT } from "./util/Constants";
import { Options } from "./util/types";
import Animals from "./Endpoints/Animals";
import Furry from "./Endpoints/Furry";

class Yiffy {
	options: Options;
	private _animals: Animals;
	private _furry: Furry;
	constructor(d?: Partial<Options>) {
		if (!d) d = {};
		this.options = {
			userAgent: d.userAgent || USER_AGENT,
			apiKey: d.apiKey || "",
			debug: d.debug || (() => null),
			baseURL: d.baseURL || API_URL,
			host: d.host || API_HOST
		};
	}

	get animals() { return this._animals || (this._animals = new Animals(this.options)); }
	get furry() { return this._furry || (this._furry = new Furry(this.options)); }

	private get debug() { return this.options.debug; }
}

export default Yiffy;
module.exports = Yiffy;
export { Yiffy };
export * from "./util/types";
