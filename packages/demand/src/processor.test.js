import Pledge from "@qoopido/pledge";
import processor from "./processor";

describe("get current()", () => {
    test("should return `null` when no current dependency is in progress", () => {
        expect(processor.current).toBe(null);
    });
});

describe("process()", () => {
    test("should correctly process a single dependency", () => {
        return new Promise((resolve, reject) => {
            const dfd = Pledge.defer();
            const callback = jest.fn(() => {
                processor.dequeue();
                dfd.resolve();
            });

            dfd.pledge
                .then(() => {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0][0]).toBe(dfd.pledge);
                    expect(callback.mock.calls[0][0].isResolved).toBe(true);

                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

            dfd.pledge.handler = {
                process: callback,
            };

            processor.enqueue(dfd.pledge);
        });
    });

    test("should correctly process multiple dependencies", () => {
        return new Promise((resolve, reject) => {
            let current = 0;
            const dfd = [Pledge.defer(), Pledge.defer()];
            const callback = jest.fn(() => {
                processor.dequeue();
                dfd[current].resolve();

                current++;
            });

            Pledge.all([dfd[0].pledge, dfd[1].pledge])
                .then(() => {
                    expect(callback.mock.calls.length).toBe(2);
                    expect(callback.mock.calls[0][0]).toBe(dfd[0].pledge);
                    expect(callback.mock.calls[0][0].isResolved).toBe(true);
                    expect(callback.mock.calls[1][0]).toBe(dfd[1].pledge);
                    expect(callback.mock.calls[1][0].isResolved).toBe(true);

                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

            dfd[0].pledge.handler = {
                process: callback,
            };

            dfd[1].pledge.handler = {
                process: callback,
            };

            processor.enqueue(dfd[0].pledge, dfd[1].pledge);
        });
    });

    test("should correctly process multiple dependencies skipping any settled", () => {
        return new Promise((resolve, reject) => {
            let current = 1;
            const dfd = [Pledge.defer(), Pledge.defer()];
            const callback = jest.fn(() => {
                processor.dequeue();
                dfd[current].resolve();

                current++;
            });

            dfd[0].resolve();

            Pledge.all([dfd[0].pledge, dfd[1].pledge])
                .then(() => {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0][0]).toBe(dfd[1].pledge);
                    expect(callback.mock.calls[0][0].isResolved).toBe(true);

                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

            dfd[1].pledge.handler = {
                process: callback,
            };

            processor.enqueue(dfd[0].pledge, dfd[1].pledge);
        });
    });

    test("should correctly process multiple dependencies skipping any invalid ones", () => {
        return new Promise((resolve, reject) => {
            let current = 2;
            const dfd = [Pledge.defer(), Pledge.defer(), Pledge.defer()];
            const callback = jest.fn(() => {
                processor.dequeue();
                dfd[current].resolve();

                current++;
            });

            Pledge.all([dfd[2].pledge])
                .then(() => {
                    expect(callback.mock.calls.length).toBe(1);
                    expect(callback.mock.calls[0][0]).toBe(dfd[2].pledge);
                    expect(callback.mock.calls[0][0].isResolved).toBe(true);

                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });

            dfd[1].pledge.handler = {};

            dfd[2].pledge.handler = {
                process: callback,
            };

            processor.enqueue(dfd[0].pledge, dfd[1].pledge, dfd[2].pledge);
        });
    });
});
