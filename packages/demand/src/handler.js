/**
 * Class Handler
 */
export default class Handler {
    /**
     * Constructor
     */
    constructor() {
        this.enqueue = true;
        this.validate = null;
        this.onPreRequest = null;
        this.onPostRequest = null;
        this.onPreProcess = null;
        this.process = null;
    }
}
