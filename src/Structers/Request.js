import axios from "axios";

/**
 * @typedef ReqParams
 * @type {Object}
 * @property {Object} data - Data to Send along
 * @property {Object} Headers - Headers that should tag along
 */

/**
 * Request handler for sending api requests
 * @class
 */
export class RequestHandler {
    /**
     * Base URL that would add up with URI
     * @private
     * @type {String}
     */
    #BaseURL;

    /**
     * @param {String} ServerURL Server URL that would be added with URI in requests
     */
    constructor(ServerURL)
    {
        this.BaseURL = ServerURL;

        /**
         * Send a Request
         * @description Send a Request
         * @param {String} uri Endpoint to add with ServerURL
         * @param {String} method Method to send such as GET/POST/....
         * @param {ReqParams} params an Object to send to the Endpoint Such as `Headers` and `data`
         * @returns {Promise<any>}
         */
        this.send = (uri, method = 'get', params = {}) =>
        {
            return axios[method]
                (
                    uri,
                    {
                        baseURL: this.BaseURL,
                        data: ('data' in params && params['data']) ? params.data : null,
                        Headers: ('Headers' in params && params['Headers']) ? params.Headers : null,
                    }
                );
        }
    }
}