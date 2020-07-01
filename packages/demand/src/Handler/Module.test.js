import Emitter from "@qoopido/emitter";
import HandlerModule from "./Module";

describe("HandlerModule()", () => {
    test("should return an instance of `HandlerModule` when successful", () => {
        expect(new HandlerModule() instanceof HandlerModule).toBe(true);
    });

    test("should have its properties correctly set", () => {
        const instance = new HandlerModule();

        expect(instance.enqueue).toBe(true);
        expect(typeof instance.validate === 'function').toBe(true);
        expect(instance.onPreRequest).toBe(null);
        expect(instance.onPostRequest).toBe(null);
        expect(instance.onPreProcess).toBe(null);
        expect(typeof instance.process === 'function').toBe(true);
    });

    test("should listen to `postConfigure:@qoopido/demand/handler/module` events", () => {
        const instance = new HandlerModule();
        const emitter = new Emitter();

        emitter.emit('postConfigure:@qoopido/demand/handler/module', {
            mimetype: /^text\/plain/,
        });

        expect(instance.validate('application/javascript')).toBe(false);
        expect(instance.validate('text/plain')).toBe(true);

        emitter.emit('postConfigure:@qoopido/demand/handler/module', {
            mimetype: /^(application|text)\/(x-)?javascript/,
        });
    });

    test("should ignore invalid `postConfigure:@qoopido/demand/handler/module` events", () => {
        const instance = new HandlerModule();
        const emitter = new Emitter();

        emitter.emit('postConfigure:@qoopido/demand/handler/module', []);

        expect(instance.validate('application/javascript')).toBe(true);
    });
});

describe("process()", () => {
    test("should inject a script-tag containing a dependencies source", () => {
        const source = 'var test = ' + performance.now() + ';';
        const instance = new HandlerModule();
        let loaded = false;

        instance.process({ id: test, source: source })

        const result = document.querySelectorAll("script");

        Array.prototype.slice.call(result).forEach(function(node) {
            loaded = node.textContent === source;

            node.parentNode.removeChild(node);
        });

        expect(loaded).toBe(true);
    });

    test("should ignore dependencies without source", () => {
        const instance = new HandlerModule();

        instance.process({ id: test, source: null })

        const result = document.querySelectorAll("script");

        expect(result.length).toBe(0);
    });
});
