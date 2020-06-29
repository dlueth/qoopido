import { name } from "../package.json";

const DEFAULT_HANDLER = "module";
const EVENT_PREFIX = "pre";
const EVENT_POSTFIX = "post";
const EVENT_CONFIGURE = "Configure";
const EVENT_RESOLVE = "Resolve";
const EVENT_PRE_CONFIGURE = EVENT_PREFIX + EVENT_CONFIGURE;
const EVENT_POST_CONFIGURE = EVENT_POSTFIX + EVENT_CONFIGURE;
const EVENT_PRE_RESOLVE = EVENT_PREFIX + EVENT_RESOLVE;
const EVENT_POST_RESOLVE = EVENT_POSTFIX + EVENT_RESOLVE;
const ID_DEMAND = "demand";
const ID_EXPORTS = "exports";
const ID_PATH = "path";
const ID_PROVIDE = "provide";
const PATH_HANDLER = name + "/handler/";
const PREFIX_INTERNAL = "internal!";
const PREFIX_MOCK = "mock:";
const STRING_BOOLEAN = "boolean";
const STRING_FUNCTION = "function";
const STRING_NUMBER = "number";
const STRING_OBJECT = "object";
const STRING_STRING = "string";
const STRING_UNDEFINED = "undefined";

export {
    DEFAULT_HANDLER,
    EVENT_PRE_CONFIGURE,
    EVENT_POST_CONFIGURE,
    EVENT_PRE_RESOLVE,
    EVENT_POST_RESOLVE,
    ID_DEMAND,
    ID_EXPORTS,
    ID_PATH,
    ID_PROVIDE,
    PATH_HANDLER,
    PREFIX_INTERNAL,
    PREFIX_MOCK,
    STRING_BOOLEAN,
    STRING_FUNCTION,
    STRING_NUMBER,
    STRING_OBJECT,
    STRING_STRING,
    STRING_UNDEFINED,
};
