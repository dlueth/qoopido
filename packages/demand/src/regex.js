import resolveUrl from "./resolve/url";

const isRelative = /^\.?\.\//;
const matchBase = new RegExp('^' + resolveUrl('/'));
const matchParameter = /^(mock:)?([+-])?((?:[-\w]+\/?)+)?(?:@(.+?))?(?:#(\d+))?!/;

export {
    isRelative,
    matchBase,
    matchParameter
};
