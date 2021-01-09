## <center>Furry Bot API</center>

### Advantages of this api:
* Requires no authentication, so it is easier to use
* All image are HAND PICKED by the api creator, [Donovan_DMC](https://furry.cool) (note: if you find an image that seems out of place, report it in [our Discord server](https://yiff.rest/support), I try to do my best, but I'm not perfect!)
* The api has multiple instances running, so requests are solved fast, even when there are many people accessing the api at one time!
* Everything is served from our cdn ([yiff.media](https://yiff.media))
* [99.9% uptime](https://status.yiff.rest/)

### This is the **only** official api wrapper for [yiff.rest](https://docs.yiff.rest), with special typescript support for all endpoints!

### You can get the available methods from the typings, or by making a request to [https://yiff.rest/V2/categories](https://yiff.rest/categories), replace the periods in the `db` property with forward slashes, and use that as the url.

### If you are building this module from scratch, you will need to build it using `npm run build`, this will put the js files you need in the `build` folder. (you will need typescript to be installed globally (npm i -g typescript) to use the typescript compiler) 

Requests on the default api are converted to methods by replacing forward slashes with periods.
ex  
https://yiff.rest/V2/animals/birb -> animals.birb()  
https://yiff.rest/V2/furry/hug -> furry.hug()  
https://yiff.rest/V2/furry/yiff/gay -> furry.yiff.gay()  

this module can return an image, or 1-5 json responses.
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
