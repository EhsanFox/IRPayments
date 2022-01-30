import { EngineBase } from "../../Structers/EngineBase.js";
import { RequestHandler } from "../../Structers/Request.js";
import * as ErrorCodes from "./Errors.json";
import * as TransCodes from "./TransactionCodes.json";

/**
 * @typedef PaymentParams
 * @type {Object}
 * @property {String} name - a Name
 * @property {String} phone - a Phone number in length of 11
 * @property {String} mail - an Email Address
 * @property {String} desc - a Description for the Payment/order
 * @property {String} callback - a Callback URL
 * @property {Boolean} sandbox - Turn this Action as a Sandbox
 */

/**
 * @typedef IDPayHeader
 * @type {Object}
 * @property {String} X-API-KEY - IDPay API Key
 * @property {String} X-SANDBOX - Send Request as a SandBox
 */

export class IDPayEngine extends EngineBase {

    /**
     * Token String for Payments
     * @private
     * @type {String}
     */
    #Token;

    /**
     * Request Handler for IDPay Class
     * @private
     * @type {RequestHandler}
     */
    #Request;

    /**
     * IDPay Version Tag (Must be Supported by IDPay)
     * @type {String}
     */
    Version = "v1.1";

    /**
     * @param {String} token  IDPay API Token
     * @param {String} name Name of the Engine
     */
    constructor(token, name = "")
    {
        if(!token || token == '' || token == ' ')
            throw new Error('Token is invalid.');

        super(name);
        this.#Token = token;

        /**
         * @param {Boolean} sandbox Enable Sandbox or not
         * @returns {IDPayHeader}
         */
        this.GetHeader = (sandbox = false) => {
            let res = {
                'X-API-KEY': this.#Token,
                'X-SANDBOX': sandbox ?? false
            };
            return res;
        }
        

        /**
         * Create a Payment
         * @param {String} id ID of Order/Payment - 50 Length at the Must
         * @param {Number} amount Money Amount that you want in IRR (Rial)
         * @param {PaymentParams} params Some Params that are optional
         * @returns {Promise<any>} Whatver the axios would return
         */
        this.CreatePayment = (id, amount, params = {}) => {

            if(!id || id == '' || id == ' ' || typeof id !== 'string' || id.length > 50)
                throw new Error(`ID is Invalid.`);

            if(!amount || typeof amount == 'number' || amount == 0 || amount > 500000000 || amount < 1000)
                throw new Error(`Amount number is Invalid.`);

            let paymentObject = {
                order_id: id,
                amount,
            };
            let sandBox = ('sandbox' in params && typeof params['sandbox'] == 'boolean') ? params['sandbox'] : false;

            if(!Object.is({}, params))
            {
                if('name' in params && typeof params['name'] == 'string')
                    paymentObject.name = params.name;
                
                if('phone' in params && typeof params['phone'] == 'string')
                    paymentObject.phone = params.phone;

                if('mail' in params && typeof params['mail'] == 'string')
                    paymentObject.mail = params.mail;

                if('desc' in params && typeof params['desc'] == 'string')
                    paymentObject.desc = params.desc;

                if('callback' in params && typeof params['callback'] == 'string')
                    paymentObject.callback = params.callback;

            }

            return this.#Request.send(`/payment`, 'POST', {
                data: paymentObject,
                Headers: this.GetHeader(sandBox)
            })
        }

        /**
         * Verify a Created Payment (or the Callback)
         * @param {String} recivedID ID That you recived after Creating a payment with `CreatePayment` Method
         * @param {String} createdID ID That you sent for Creating a Payment with `CreatePayment` Method
         * @param {Boolean} sandBox Send The Request as a SandBox Request
         * @returns {Promise<any>} Whatver the axios would return
         */
        this.VerifyPayment = (recivedID, createdID, sandBox = false) => {

            if(!recivedID || typeof recivedID !== 'string')
                throw new Error(`RecivedID is invalid.`);
            if(!createdID || typeof createdID !== 'string')
                throw new Error(`CreatedID is invalid.`);

            return this.#Request.send(`/payment/verify`, `POST`, {
                data: {
                    id: recivedID,
                    order_id: createdID
                },
                Headers: this.GetHeader(sandBox)
            })
        }

        /**
         * Get Status of a Created Payment
         * @param {String} recivedID ID That you recived after Creating a payment with `CreatePayment` Method
         * @param {String} createdID ID That you sent for Creating a Payment with `CreatePayment` Method
         * @param {Boolean} sandBox Send The Request as a SandBox Request
         * @returns {Promise<any>} Whatver the axios would return
         */
        this.PaymentStatus = (recivedID, createdID, sandBox = false) => {

            if(!recivedID || typeof recivedID !== 'string')
                throw new Error(`RecivedID is invalid.`);
            if(!createdID || typeof createdID !== 'string')
                throw new Error(`CreatedID is invalid.`);

            return this.#Request.send(`/payment/inquiry`, `POST`, {
                data: {
                    id: recivedID,
                    order_id: createdID
                },
                Headers: this.GetHeader(sandBox)
            })    ;
        }

        /**
         * Get a List of all Transactions
         * @param {Number} pageNumber Page Number to fetch the Transactions (default is 0)
         * @param {Number} pageSize Data size that would be fetched from the Page (Default is the last 25)
         * @param {Boolean} sandBox Send The Request as a SandBox Request
         * @returns {Promise<any>} Whatver the axios would return
         */
        this.Transactions = (pageNumber = 0, pageSize = 25, sandBox = false) => {

            if(typeof pageNumber !== 'number')
                throw new Error(`Page number is invalid.`);
            if(typeof pageSize !== 'number')
                throw new Error(`Page size is invalid.`);

            return this.#Request.send(`/payment/transactions`, `POST`, {
                data: {
                    page: pageNumber,
                    page_size: pageSize,
                },
                Headers: this.GetHeader(sandBox)
            });
        }

        /**
         * Get Transaction Message by Code
         * @param {String} code Transaction Code
         * @returns {String} Message in Persian
         */
        this.GetMessage = (code) => {

            if(!code || typeof code !== 'string' || code == '' || code == ' ' || !code in this.TransactionCodes)
                throw new Error(`Transaction Code is invalid.`);
            
            return this.TransactionCodes[code]
        }

        /**
         * Get Error Message
         * @param {String} statusCode StatusCode that would be in the Response Header (such as 200, 404, ....)
         * @param {String} errorCode Error code that you would recive in the callback from IDPay (a random number)
         * @returns {String} Message in Persian
         */
        this.GetError = (statusCode, errorCode) => {
            if(!statusCode || typeof statusCode !== 'string' || statusCode == '' || statusCode == ' ' || !statusCode in this.Errors)
                throw new Error(`Status Code is Invalid.`);
            if(!errorCode || typeof errorCode !== 'string' || errorCode == '' || errorCode == ' ' || !errorCode in this.Errors[statusCode])
                throw new Error(`Error Code is Invalid.`);

            return this.Errors[statusCode][errorCode];
        }

        /**
         * All Transactions Codes and their Meaning
         */
        this.TransactionCodes = TransCodes;

        /**
         * All Error Codes and Their Meaning
         */
        this.Errors = ErrorCodes;
    }

}