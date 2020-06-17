import merge from "./merge";

describe("merge()", () => {
    test("should correctly deep-merge any number of objects", () => {
        const target = {};
        const object1 = {
            first: true,
            second: { first: false },
            third: [1, 2, 3],
            fourth: undefined,
        };
        const object2 = {
            first: { first: true },
            second: { first: true, second: true },
            third: [4, 5, 6],
        };

        expect(merge(target, object1, object2)).toMatchObject({
            first: { first: true },
            second: { first: true, second: true },
            third: [1, 2, 3, 4, 5, 6],
        });
    });

    test("should modify target", () => {
        const target = {};
        const object1 = {
            first: true,
            second: { first: false },
            third: [1, 2, 3],
            fourth: undefined,
        };
        const object2 = {
            first: { first: true },
            second: { first: true, second: true },
            third: [4, 5, 6],
        };

        merge(target, object1, object2);

        expect(target).toMatchObject({
            first: { first: true },
            second: { first: true, second: true },
            third: [1, 2, 3, 4, 5, 6],
        });
    });
});
