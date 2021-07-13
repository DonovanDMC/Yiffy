import pkg from "../../package.json";

export const API_VERSION = "V2";
export const API_URL = `https://${API_VERSION.toLowerCase()}.yiff.rest`;
export const API_HOST = `${API_VERSION.toLowerCase()}.yiff.rest`;
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
	size: "X-Yiffy-Image-Size",
	ext: "X-Yiffy-Image-Extension"
};
export const USER_AGENT = `Yiffy/${pkg.version} (https://${API_VERSION.toLowerCase()}.yiff.rest, https://github.com/DonovanDMC/Yiffy)`;
