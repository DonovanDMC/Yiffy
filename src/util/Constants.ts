import pkg from "../../package.json";

export const API_URL = "https://yiff.rest";
export const API_HOST = "yiff.rest";
export const API_VERSION = "V2";
export const API_HEADERS = {
	artists: "X-Yiffy-Artist",
	source: "X-Yiffy-Source",
	width: "X-Yiffy-Image-Width",
	height: "X-Yiffy-Image-Height",
	url: "X-Yiffy-Image-URL",
	shortURL: "X-Yiffy-Short-URL",
	reportURL: "X-Yiffy-Report-URL",
	type: "X-Yiffy-Image-Type",
	name: "X-Yiffy-Image-Name",
	ext: "X-Yiffy-Image-Extension"
};
export const USER_AGENT = `Yiffy/${pkg.version} (https://api.furry.bot/V2, https://github.com/FurryBotCo/Yiffy)`;
