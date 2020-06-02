/* istanbul ignore next */
export default (typeof globalThis === "object" &&
    globalThis.globalThis === globalThis &&
    globalThis) ||
    (typeof self === "object" && self.self === self && self) ||
    (typeof global === "object" && global.global === global && global);
