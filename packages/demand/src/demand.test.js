import Pledge from "@qoopido/pledge";
import global from "@qoopido/global";
import HandlerModule from "./Handler/Module";
import demand from "./demand";

describe("demand()", () => {
    test("should return a `Pledge` when successful", () => {
        expect(demand("@qoopido/demand/handler/module") instanceof Pledge).toBe(
            true
        );
    });

    test("should resolve when successful", () => {
        return new Promise((resolve, reject) => {
            demand(
                "@qoopido/demand/handler/module",
                "@qoopido/demand/handler/module"
            )
                .then(function (module1, module2) {
                    expect(arguments.length).toBe(2);
                    expect(module1 instanceof HandlerModule).toBe(true);
                    expect(module2 instanceof HandlerModule).toBe(true);

                    resolve();
                })
                .catch(reject);
        });
    });

    test("should resolve with given value when dependency is not of type string", () => {
        return new Promise((resolve, reject) => {
            const dummyObject = { now: performance.now };
            const dummyArray = [performance.now];

            demand(dummyObject, dummyArray)
                .then(function (module1, module2) {
                    expect(arguments.length).toBe(2);
                    expect(module1).toBe(dummyObject);
                    expect(module2).toBe(dummyArray);

                    resolve();
                })
                .catch(reject);
        });
    });

    test("should respect a given context", () => {
        return new Promise((resolve, reject) => {
            demand
                .call(
                    global,
                    "@qoopido/demand/handler/module",
                    "@qoopido/demand/handler/module"
                )
                .then(function (module1, module2) {
                    expect(arguments.length).toBe(2);
                    expect(module1 instanceof HandlerModule).toBe(true);
                    expect(module2 instanceof HandlerModule).toBe(true);

                    resolve();
                })
                .catch(reject);

            demand
                .call(
                    "@qoopido/demand/",
                    "./Handler/Module",
                    "@qoopido/demand/handler/module"
                )
                .then(function (module1, module2) {
                    expect(arguments.length).toBe(2);
                    expect(module1 instanceof HandlerModule).toBe(true);
                    expect(module2 instanceof HandlerModule).toBe(true);

                    resolve();
                })
                .catch(reject);
        });
    });
});
