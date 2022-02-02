const RequestHandler = require("../../Structers/Request");
const ErrorCodes = require("./Errors.json");

/**
 * @typedef OptionalParams
 * @type {Object}
 * @property {String} desc - a Description for the Payment
 * @property {String} mail - an Email Address
 * @property {String} phone - a Phone number in length of 11
 * @property {Boolean} sandbox - Turn this Action as a Sandbox
 */

/**
 * @class
 * @classdesc ZarinPal Engine Class
 * Create a Connection between ZarinPal Gateway
 */
class ZarinpalEngine {

    /**
     * Token String for Payments
     * @private
     * @type {String}
     */
    #Token;

     /**
      * Request Handlers
      * @private
      */
    #Request = {
        normal: new RequestHandler("https://www.zarinpal.com/pg/rest/WebGate"),
        sandbox: new RequestHandler("https://sandbox.zarinpal.com/pg/rest/WebGate/")
    };

    /**
    * All Error Codes and Their Meaning
    */
    Errors = ErrorCodes;

    /**
     * @param {String} token API-Token of ZarinPal (Must be 36 Chars)
     */
    constructor(token)
    {
        if(!token || typeof token !== 'string' || token == '' || token == ' ' || token.length < 36)
            throw new Error('Token is invalid.');

        this.#Token = token;
    }

    /**
    * Get the Base Object for Sending Request
    * @private
    */
    #GetHeader()
    {
        let res = {
            MerchantID: this.#Token
        };
        return res;
    }

    /**
    * Create a Payment
    * @param {Number} amount Money Amount that you want in Tomans
    * @param {String} callbackURL an URL that the user would be redirected after payment
    * @param {OptionalParams} options Some optional stuff
    * @returns {Promise<any>} Whatver the axios would return
    */
    CreatePayment(amount, callbackURL, options = { sandbox: false })
    {
            
        if(!amount || typeof amount !== 'number' || amount < 1000)
            throw new Error(`Amount is invalid.`);
        if(!callbackURL || typeof callbackURL !== 'string' || callbackURL == '' || callbackURL == ' ')
            throw new Error(`CallbackURL is invalid.`);

        let data = this.#GetHeader();
        data.Amount = amount;
        data.CallbackURL = callbackURL;
        data.Description = ('desc' in options && typeof options['desc'] == 'string') ? options['desc'] : '';
        data.Email = ('mail' in options && typeof options['mail'] == 'string') ? options['mail'] : '';
        data.Mobile = ('phone' in options && typeof options['phone'] == 'string') ? options['phone'] : '';

        if('sandbox' in options && options['sandbox'])
            return this.#Request.sandbox.send(`/PaymentRequest.json`, 'POST', { data, })
        else
            return this.#Request.normal.send(`/PaymentRequest.json`, 'POST', { data, })
    }

    /**
    * Verify a Created Payment
    * @param {Number} amount Money Amount that you want in Tomans
    * @param {String} authCode Authority Code that you recived after Creating a payment
    * @param {Boolean} sandBox Send the Request as a SandBox Request
    * @returns {Promise<any>} Whatver the axios would return
    */
    VerifyPayment(amount, authCode, sandBox = false)
    {
        if(!amount || typeof amount !== 'number' || amount < 1000)
            throw new Error(`Amount is invalid.`);
        if(!authCode || typeof authCode !== 'string' || authCode == '' || authCode == ' ')
            throw new Error(`authCode is invalid.`);

        let data = this.#GetHeader();
        data.Amount = amount;
        data.Authority = authCode;

        if(sandBox)
            return this.#Request.sandbox.send(`/PaymentVerification.json`, 'POST', { data, })
        else
            return this.#Request.normal.send(`/PaymentVerification.json`, 'POST', { data, })
    }

    /**
    * Refresh an Auth Code to Work again
    * @param {String} authCode Authority Code that you recived after Creating a payment
    * @param {Number} expireTime Amount of time that you want the authCode to work (in seconds)
    * @param {Boolean} sandBox Send the Request as a SandBox Request
    * @returns {Promise<any>} Whatver the axios would return
    */
    RefreshAuth(authCode, expireTime, sandBox = false)
    {

        if(!authCode || typeof authCode !== 'string' || authCode == '' || authCode == ' ')
            throw new Error(`authCode is invalid.`);
        if(!expireTime || typeof expireTime !== 'number' || expireTime < 120)
            throw new Error(`expireTime is invalid.`);

        if(sandBox)
            return this.#Request.sandbox.send(`/RefreshAuthority.json`, 'POST', { data, })
        else
            return this.#Request.normal.send(`/RefreshAuthority.json`, 'POST', { data, })
    }

    /**
    * Recive Failed(un-paied) Payments
    * @param {Boolean} sandBox Fetch SandBox Payments
    * @returns {Promise<any>} Whatver the axios would return
    */
    Transactions(sandBox = false)
    {
        let data = this.#GetHeader();

        if(sandBox)
            return this.#Request.sandbox.send(`/UnverifiedTransactions.json`, 'POST', { data, })
        else
            return this.#Request.normal.send(`/UnverifiedTransactions.json`, 'POST', { data, })
    }

    /**
    * Get Error Message
    * @param {String} errorCode Error code that you would recive in the callback from ZarinPal (a number)
    * @returns {String} Message in Persian
    */
    GetError(errorCode)
    {
        if(!errorCode || typeof errorCode !== 'string' || errorCode == '' || errorCode == ' ' || !errorCode in this.Errors[statusCode])
            throw new Error(`Error Code is Invalid.`);

        return this.Errors[statusCode];
    }
}

module.exports = ZarinpalEngine;