import { MessageChannel, MessagePort } from "worker_threads";
import isTransferable from "./isTransferable";

describe("isTransferable()", () => {
    test("should return true for transferable values", () => {
        expect(isTransferable(new ArrayBuffer(8))).toBe(true);
        expect(isTransferable(new MessageChannel().port1)).toBe(true);
        expect(isTransferable(new MessageChannel().port2)).toBe(true);
        expect(isTransferable(new ImageBitmap())).toBe(true);
    });
});
