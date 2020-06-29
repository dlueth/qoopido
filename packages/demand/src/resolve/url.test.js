import resolveUrl from "./url";

describe("resolveUrl()", () => {
    test("should return correct URLs for all kinds of valid input", () => {
        expect(resolveUrl("https://localhost")).toBe("https://localhost/");
        expect(resolveUrl("./test/resolveUrl")).toBe(
            "http://localhost/test/resolveUrl"
        );
        expect(resolveUrl("./test/resolveUrl/../anotherOne")).toBe(
            "http://localhost/test/anotherOne"
        );
        expect(resolveUrl("./test/resolveUrl/../anotherOne")).toBe(
            "http://localhost/test/anotherOne"
        );
    });
});
