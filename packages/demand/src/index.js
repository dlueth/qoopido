import Emitter from "@qoopido/emitter";
import { version } from "../package.json";
import settings from "./settings";

export default function demand() {}

demand.version = version;
demand.on = Emitter.on;
demand.once = Emitter.once;
demand.limit = Emitter.limit;
demand.off = Emitter.off;
demand.configure = settings.update;
