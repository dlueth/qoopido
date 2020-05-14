const uuid = require("../../dist/helper/uuid");
const matchUuid = /(?:^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}$)|(?:^0{8}-0{4}-0{4}-0{4}-0{12}$)/u;

describe("Uuid()", () => {
    test("generated UUIDs should validate", () => {
        var i = 0;

        for (i; i < 1000; i++) {
            expect(matchUuid.test(uuid())).toBe(true);
        }
    });

    test("subsequent UUIDs should always be different", () => {
        var i = 0;

        for (i; i < 1000; i++) {
            expect(uuid()).not.toMatch(uuid());
        }
    });
});
