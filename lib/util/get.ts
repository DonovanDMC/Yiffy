import { API_HOST } from "./Constants";
import * as https from "node:https";
import { URL } from "node:url";

export default async function get(url: string, ua: string, auth?: string, host?: string): Promise<{
    body: Buffer;
    headers: Record<string, string | Array<string>>;
    statusCode: number;
    statusMessage: string;
}> {
    return new Promise((a, b) => {
        const u = new URL(url);
        https
            .get({
                host:    u.host,
                path:    `${u.pathname}${u.search}`,
                port:    url.includes("https") ? 443 : 80,
                method:  "GET",
                headers: {
                    "User-Agent": ua,
                    "Host":       host || API_HOST,
                    ...(auth ? ({
                        Authorization: auth
                    }) : ({}))
                }
            }, res => {
                const d: Array<Buffer> = [];

                res
                    .on("data", d.push.bind(d))
                    .on("error", err => b(err))
                    .on("end", () => a({
                        headers:       res.headers as unknown as Record<string, string | Array<string>>,
                        body:          Buffer.concat(d),
                        statusCode:    res.statusCode!,
                        statusMessage: res.statusMessage!
                    }));
            })
            .end();
    });
}
