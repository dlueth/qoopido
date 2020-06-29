import global from "@qoopido/global";
import Emitter from "@qoopido/emitter";
import { helper } from "@qoopido/utility";
import { isObject } from "@qoopido/validator";
import { version } from "../package.json";
import demand from "./demand";
import provide from "./provide";
import settings from "./settings";
import list from "./list";

demand.version = version;
demand.on = Emitter.on;
demand.once = Emitter.once;
demand.limit = Emitter.limit;
demand.off = Emitter.off;
demand.configure = settings.update;
demand.list = list;

demand.configure(
    helper.merge({}, isObject(global.demand) ? global.demand : {})
);

global.demand = demand;
global.provide = provide;

export { demand, provide };
