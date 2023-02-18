import type { APIFunction } from "./types";
import pkg from "../../package.json";

export const API_VERSION = "V2";
export const API_URL = `https://${API_VERSION.toLowerCase()}.yiff.rest`;
export const API_HOST = `${API_VERSION.toLowerCase()}.yiff.rest`;
export const THUMBS_URL = "https://thumbs.yiff.rest";
export const THUMBS_HOST = "thumbs.yiff.rest";
export const SHORTENER_URL = "https://yiff.rocks";
export const SHORTENER_HOST = "yiff.rocks";
export const API_HEADERS = {
    artists:   "X-Yiffy-Artist",
    source:    "X-Yiffy-Source",
    width:     "X-Yiffy-Image-Width",
    height:    "X-Yiffy-Image-Height",
    url:       "X-Yiffy-Image-URL",
    shortURL:  "X-Yiffy-Short-URL",
    reportURL: "X-Yiffy-Report-URL",
    type:      "X-Yiffy-Image-Type",
    name:      "X-Yiffy-Image-Name",
    size:      "X-Yiffy-Image-Size",
    ext:       "X-Yiffy-Image-Extension"
};
export const USER_AGENT = `Yiffy/${pkg.version} (https://github.com/DonovanDMC/Yiffy)`;

export enum YiffyErrorCodes {
    INTERNAL_ERROR   = 0,
    RATELIMIT_ROUTE  = 1000,
    RATELIMIT_GLOBAL = 1001,
    SUSPECTED_BROWSER_IMPERSONATION = 1002,

    INVALID_API_KEY  = 1010,
    INACTIVE_API_KEY = 1011,
    DISABLED_API_KEY = 1012,
    API_KEY_REQUIRED = 1013,

    DISK_FULL             = 1020,
    BLOCKED_USERAGENT     = 1021,
    SERVICE_NO_ACCESS     = 1022,
    UNKNOWN_ROUTE         = 1024,
    METHOD_NOT_ALLOWED    = 1025,

    // legacy codes that are spread out
    IMAGES_INVALID_RESPONSE_TYPE = 1023,
    IMAGES_CATEGORY_NOT_FOUND    = 1030,
    IMAGES_EMPTY_CATEGORY        = 1031,
    IMAGES_NOT_FOUND             = 1040,
    IMAGES_AMOUNT_GT_ONE_IMAGE   = 1050,
    IMAGES_AMOUNT_LT_ONE         = 1051,
    IMAGES_AMOUNT_GT_FIVE        = 1052,

    THUMBS_GENERIC_ERROR   = 1060,
    THUMBS_INVALID_POST_ID = 1062,
    THUMBS_INVALID_MD5     = 1063,
    THUMBS_INVALID_TYPE    = 1064,
    THUMBS_TIMEOUT         = 1065,
    THUMBS_CHECK_NOT_FOUND = 1066,

    SHORTENER_CODE_TOO_LONG            = 1070,
    SHORTENER_INVALID_CODE             = 1071,
    SHORTENER_CODE_IN_USE              = 1072,
    SHORTENER_INVALID_URL              = 1073,
    SHORTENER_CREDIT_TOO_LONG          = 1074,
    SHORTENER_NOT_FOUND                = 1075,
    SHORTENER_MANAGEMENT_CODE_REQUIRED = 1076,
    SHORTENER_NO_MANAGEMENT_CODE       = 1077,
    SHORTENER_MANAGEMENT_CODE_MISMATCH = 1078,
    SHORTENER_URL_IN_USE               = 1079,
    SHORTENER_NO_CHANGES               = 1080,
}

const ImageMethod = null as unknown as APIFunction;
export const ImagesStructure = {
    animals: {
        birb:   ImageMethod,
        blep:   ImageMethod,
        dikdik: ImageMethod
    },
    furry: {
        boop:    ImageMethod,
        bulge:   ImageMethod,
        butts:   ImageMethod,
        cuddle:  ImageMethod,
        flop:    ImageMethod,
        fursuit: ImageMethod,
        hold:    ImageMethod,
        howl:    ImageMethod,
        hug:     ImageMethod,
        kiss:    ImageMethod,
        lick:    ImageMethod,
        propose: ImageMethod,
        yiff:    {
            andromorph: ImageMethod,
            gay:        ImageMethod,
            gynomorph:  ImageMethod,
            lesbian:    ImageMethod,
            straight:   ImageMethod
        }
    }
};
