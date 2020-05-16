/* istanbul ignore file */
import { isTypeof } from "@qoopido/validator";

export default (function () {
    if (!isTypeof(self, "undefined")) {
        return self;
    }

    if (!isTypeof(window, "undefined")) {
        return window;
    }

    if (!isTypeof(global, "undefined")) {
        return global;
    }
})();
