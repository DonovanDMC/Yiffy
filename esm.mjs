const Yiffy = (await import("./dist/lib/index.js")).default.default;
export * from "./dist/lib/util/Constants.js";
const APIError = (await import("./dist/lib/util/APIError.js")).default.default;

export { APIError };
export default Yiffy;
