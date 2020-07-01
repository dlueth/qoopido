import "./Handler/Module";
import registry from "./registry";
import provide from "./provide";

describe("provide()", () => {
    test("dummy", () => {
        expect(true).toBe(true);
    });

    /*
    test("should successfully register a module", () => {
        const now = performance.now();
        const factory = () => {
            return now;
        }

        provide('test', factory);

        expect(registry.get('test')).toBe(now);
    });
    */
});
