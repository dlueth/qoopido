/* global $task, $isTransferable */
import { isTransferable } from "@qoopido/validator";

/**
 * Convert a given task into a worker-executable script
 *
 * @param {Function} task
 *
 * @returns {String}
 *
 * @ignore
 */
/* istanbul ignore next */
export default function create(task) {
    return (
        "$task = " +
        task +
        "; $isTransferable = " +
        isTransferable +
        "; onmessage = " +
        function (message) {
            const toArray = Array.prototype.slice;
            const data = message.data;
            let isSettled;

            function resolve() {
                if (!isSettled) {
                    const args = toArray.call(arguments);

                    isSettled = true;

                    try {
                        postMessage(
                            [data[0], 1, args],
                            args.filter($isTransferable)
                        );
                    } catch (error) {
                        reject(error);
                    }
                }
            }

            function reject(error) {
                if (!isSettled) {
                    isSettled = true;

                    postMessage([data[0], 0, error.toString()]);
                }
            }

            try {
                $task.apply($task, [resolve, reject].concat(data[1]));
            } catch (error) {
                reject(error);
            }
        }
    );
}
