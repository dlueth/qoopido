import Emitter from "@qoopido/emitter";
import { helper } from "@qoopido/utility";
import { EVENT_ENQUEUE, EVENT_DEQUEUE } from "./constant";

const weakmap = new WeakMap();

/**
 * Class Queue
 *
 * @extends Emitter
 */
export default class Queue extends Emitter {
    /**
     * Constructor
     *
     * @param {*[]} [items]
     */
    constructor(items) {
        super();

        weakmap.set(this, items ? [].concat(items) : []);
    }

    /**
     * Retrieve all items currently in queue
     */
    get items() {
        return weakmap.get(this);
    }

    /**
     * Current item of the queue
     */
    get current() {
        return weakmap.get(this)[0] || null;
    }

    /**
     * Number of items currently in queue
     */
    get length() {
        return weakmap.get(this).length;
    }

    /**
     * Adds items to the queue
     *
     * @param {...*} items
     *
     * @returns {Queue}
     *
     * @fires Queue#enqueue
     */
    enqueue() {
        let items = helper.toArray(arguments);

        weakmap.set(this, weakmap.get(this).concat(items));

        this.emit(EVENT_ENQUEUE, items);

        return this;
    }

    /**
     * Get and remove the current item from the queue
     *
     * @returns {*}
     *
     * @fires Queue#dequeue
     */
    dequeue() {
        let item = weakmap.get(this).shift();

        this.emit(EVENT_DEQUEUE, item);

        return item;
    }

    /**
     * Constant for event `enqueue`
     *
     * @returns {String}
     * @static
     */
    static get EVENT_ENQUEUE() {
        return EVENT_ENQUEUE;
    }

    /**
     * Constant for event `dequeue`
     *
     * @returns {String}
     * @static
     */
    static get EVENT_DEQUEUE() {
        return EVENT_DEQUEUE;
    }
}
