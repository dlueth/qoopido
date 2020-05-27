import Emitter from "@qoopido/emitter";
import { helper } from "@qoopido/utility";
import { EVENT_ENQUEUE, EVENT_DEQUEUE } from "./constant";

const weakmap = new WeakMap();

export default class Queue extends Emitter {
    constructor() {
        super();

        weakmap.set(this, []);
    }

    get current() {
        return weakmap.get(this)[0];
    }

    get length() {
        return weakmap.get(this).length;
    }

    enqueue() {
        let items = helper.toArray(arguments);

        weakmap.set(this, weakmap.get(this).concat(items));

        this.emit(EVENT_ENQUEUE, items);
    }

    dequeue() {
        let item = weakmap.get(this).shift();

        this.emit(EVENT_DEQUEUE, item);

        return item;
    }
}
