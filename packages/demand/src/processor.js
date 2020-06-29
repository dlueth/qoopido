import Queue from "@qoopido/queue";
import { isObject, isFunction } from "@qoopido/validator";

let current = null;

/**
 * Process the next dependency in queue
 *
 * @this Processor
 *
 * @ignore
 */
function process() {
    if (!current && this.length) {
        current = this.current;

        if (
            current.isPending &&
            isObject(current.handler) &&
            isFunction(current.handler.process)
        ) {
            current.handler.process(current);
        } else {
            this.dequeue();
        }
    }
}

/**
 * Class Processor
 */
class Processor extends Queue {
    /**
     * Constructor
     */
    constructor() {
        super();

        const boundProcess = process.bind(this);

        this.on(Queue.EVENT_ENQUEUE, boundProcess).on(
            Queue.EVENT_DEQUEUE,
            function () {
                current = null;

                boundProcess();
            }
        );
    }
}

export default new Processor();
