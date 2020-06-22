import Pledge from "@qoopido/pledge";
import { helper } from "@qoopido/utility";
import { isTransferable, isArray } from "@qoopido/validator";
import create from "./task/create";

const storage = new WeakMap();
const deferred = {};

/**
 * Class Task
 */
export default class {
    /**
     * Constructor
     *
     * @param {Function} task
     */
    constructor(task) {
        const worker = new Worker(
            URL.createObjectURL(
                new Blob([create(task)], {
                    type: "application/javascript",
                })
            )
        );

        storage.set(this, worker);

        worker.onmessage = function (message) {
            const uuid = isArray(message.data) ? message.data[0] : null;
            const dfd = uuid ? deferred[uuid] : null;

            if (!uuid || !dfd) {
                return;
            }

            if (message.data[1]) {
                dfd.resolve.apply(null, message.data[2]);
            } else {
                dfd.reject(message.data[2]);
            }

            delete deferred[uuid];
        };
    }

    /**
     * Execute the task with the given arguments
     *
     * @param {...*} arguments
     *
     * @returns {Pledge}
     */
    execute() {
        const dfd = Pledge.defer();
        const uuid = new helper.Uuid();
        const args = helper.toArray(arguments);

        deferred[uuid] = dfd;

        storage
            .get(this)
            .postMessage([uuid, args], args.filter(isTransferable));

        return dfd.pledge;
    }
}
