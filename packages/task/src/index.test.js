import path from "path";
import { writeFileSync, unlinkSync } from "fs";
import Worker from "web-worker";
import uuid from "uuid-v4";
import Task from "./index";
import create from "./task/create";

const base = path.normalize(__dirname + "/../temp/");
const storage = { worker: [], files: [] };
let fn;

global.Worker = function (fn) {
    const worker = new Worker(fn);

    storage.worker.push(worker);

    return worker;
};

if (!global.URL) {
    global.URL = {};
}

if (!global.URL.$$objects) {
    global.URL.$$objects = new Map();

    global.URL.createObjectURL = (_blob) => {
        const path = base + uuid() + ".js";

        storage.files.push(path);

        writeFileSync(
            path,
            create(fn)
                .replace(/\/\*\s+istanbul\s+.+?\*\//g, "")
                .replace(/cov_.+?\+\+(?:;|,\s+)/g, "")
        );

        return "file:" + path;
    };
}

afterAll(() => {
    storage.worker.forEach((worker) => {
        worker.terminate();
    });

    storage.files.forEach((file) => {
        unlinkSync(file);
    });
});

describe("Task()", () => {
    test("should create an instance of Task", () => {
        fn = function (resolve) {
            resolve();
        };

        const task = new Task(() => {});

        expect(task instanceof Task).toBe(true);
    });
});

describe("execute()", () => {
    test("should successfully execute a given function", () => {
        return new Promise((resolve, reject) => {
            fn = function (resolve, _reject, value) {
                resolve(value);
            };

            const value = performance.now();
            const task = new Task(() => {});

            task.execute(value)
                .then((result) => {
                    expect(result).toBe(value);

                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    });

    test("should ignore invalid postMessages from within worker", () => {
        return new Promise((resolve, reject) => {
            fn = function (resolve, reject, value) {
                postMessage("ignore");

                reject(value);
            };

            const value = performance.now();
            const task = new Task(() => {});

            task.execute(value)
                .then((result) => {
                    reject(result);
                })
                .catch((error) => {
                    resolve();
                });
        });
    });
});
