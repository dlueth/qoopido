const Emitter = require("@qoopido/emitter");
const Queue = require("../dist/index");

describe("Queue()", () => {
    test("should return a new instance", () => {
        expect(new Queue() instanceof Emitter).toBe(true);
        expect(new Queue() instanceof Queue).toBe(true);
    });
});

describe("get current()", () => {
    test("should return undefined on empty queue", () => {
        expect(new Queue().current).toBe(void 0);
    });
});

describe("get length()", () => {
    test("should return 0 on empty queue", () => {
        expect(new Queue().length).toBe(0);
    });
});

describe("enqueue()", () => {
    test("should correctly add a single item to the queue", () => {
        const queue = new Queue();
        const value = performance.now();
        const callback = jest.fn();

        queue.on("enqueue", callback);

        queue.enqueue(value);

        expect(queue.length).toBe(1);
        expect(queue.current).toBe(value);
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0].length).toBe(2);
        expect(callback.mock.calls[0][0].name).toBe("enqueue");
        expect(callback.mock.calls[0][0].context).toBe(queue);
        expect(callback.mock.calls[0][1]).toEqual([value]);
    });

    test("should correctly add multiple items to the queue", () => {
        const queue = new Queue();
        const values = Array.from(
            { length: Math.floor(Math.random() * 40) },
            () => Math.floor(Math.random() * 40)
        );
        const callback = jest.fn();

        queue.on("enqueue", callback);

        queue.enqueue.apply(queue, values);

        expect(queue.length).toBe(values.length);
        expect(queue.current).toBe(values[0]);
        expect(callback.mock.calls.length).toBe(1);
        expect(callback.mock.calls[0].length).toBe(2);
        expect(callback.mock.calls[0][0].name).toBe("enqueue");
        expect(callback.mock.calls[0][0].context).toBe(queue);
        expect(callback.mock.calls[0][1]).toEqual(values);

        values.forEach((value, index) => {
            expect(queue.dequeue()).toBe(value);
        });
    });
});

describe("dequeue()", () => {
    test("should correctly remove items from the queue", () => {
        const queue = new Queue();
        const values = Array.from(
            { length: Math.floor(Math.random() * 40) },
            () => Math.floor(Math.random() * 40)
        );
        const callback = jest.fn();

        queue.on("dequeue", callback);

        queue.enqueue.apply(queue, values);

        expect(queue.length === values.length).toBe(true);
        expect(queue.current === values[0]).toBe(true);

        values.forEach((value, index) => {
            expect(queue.dequeue()).toBe(value);
            expect(queue.length).toBe(values.length - (index + 1));
            expect(callback.mock.calls.length).toBe(index + 1);
            expect(callback.mock.calls[index].length).toBe(2);
            expect(callback.mock.calls[index][0].name).toBe("dequeue");
            expect(callback.mock.calls[index][0].context).toBe(queue);
            expect(callback.mock.calls[index][1]).toEqual(value);
        });
    });
});
