let debug: typeof import("debug") | undefined;
try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
    debug = require("debug") as typeof debug;
} catch {}
export function Debug(name: string, formatter: unknown, ...args: Array<unknown>) {
    debug?.(`yiffy:${name}`)(formatter, ...args);
}
