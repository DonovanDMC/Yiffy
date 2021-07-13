## <center>Yiffy API</center>

[![](https://nodei.co/npm/yiffy.png)](https://npm.im/yiffy)

### Advantages of this api:
* Requires no authentication, so it is easier to use
* All image are HAND PICKED by the api creator, [Donovan_DMC](https://donovan.is.gay) (note: if you find an image that seems out of place, report it in [our Discord server](https://yiff.rest/support). I try to do my best, but I'm not perfect!)
* The api has multiple instances running, so requests are solved fast, even when there are many people accessing the api at one time!
* Everything is served from our cdn ([yiff.media](https://yiff.media))
* [99.9% uptime](https://status.yiff.rest/)
* Everything is native NodeJS code, so zero dependencies!

#### This is the **only** official api wrapper for [yiff.rest](https://docs.yiff.rest), with special typescript support for all endpoints!

#### You can get the available methods from [the typings](https://github.com/DonovanDMC/Yiffy/blob/master/src/util/types.d.ts#L1-L3), or by making a request to [https://v2.yiff.rest/categories](https://v2.yiff.rest/categories). The method should be exactly the same as the db property.

##### If you are building this module from scratch, you will need to build it using `npm run build`, this will put the js files you need in the `build` folder. 

Requests are converted to methods by replacing forward slashes with periods.
examples:
* https://v2.yiff.rest/animals/birb -> animals.birb()  
* https://v2.yiff.rest/furry/hug -> furry.hug()  
* https://v2.yiff.rest/furry/yiff/gay -> furry.yiff.gay()  

This module can return an image, or 1-5 json responses.
### Image:
```ts
import Yiffy from "yiffy";
import * as fs from "fs";
const y = new Yiffy();

y.furry.hug("image").then(res => fs.writeFileSync(`${__dirname}/file.png`, res.image));
```

### JSON (1):
```ts
import Yiffy from "yiffy";
const y = new Yiffy();

y.furry.hug("json").then(res => console.log(res)); // 1 JSON response, "json" can be omitted
```

### JSON (2+):
```ts
import Yiffy from "yiffy";
const y = new Yiffy();

y.furry.hug("json", 2).then(res => console.log(res)); // 2 json responses, an array
```

### The options that can be provided are as follows (all optional):
* (string) userAgent - the user agent to use with requests, see [this message](https://discord.com/channels/760631859385335838/797495172023320616/851061761050542100) for the reccomended format
* (string) apikey - your api key, if you have one (contact me on Discord if you want one)
* (function) debug - a function for debug logging, its parameters are the request url, and an object of: start time, end time, total time taken for the request
* (string) baseURL - The base url for the api, default: "https://v2.yiff.rest" (version MUST be included here, only subdomain versioning is supported)
* (string) host - the value of the `Host` header sent with requests
