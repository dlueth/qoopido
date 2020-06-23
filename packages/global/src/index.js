let result;

/* istanbul ignore else  */
if (typeof globalThis === "object" && globalThis.globalThis === globalThis) {
    result = globalThis;
} else if (typeof self === "object" && self.self === self) {
    result = self;
} else if (typeof global === "object" && global.global === global) {
    result = global;
}

export default result;
