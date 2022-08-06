import axios, { AxiosError } from "axios";
import { IDPay as IDPayTypes } from "../../types"
import ErrorCodes from "./Errors";
import TransCodes from "./TransactionCodes";

export class IDPay {

    /**
    * All Transactions Codes and their Meaning
    */
    TransactionCodes = TransCodes;

      /**
     * All Error Codes and Their Meaning
     */
    Errors = ErrorCodes;

    readonly apiUrl: string

    private Request

    constructor(private readonly token: string, readonly version = "v1.1")
    {
        this.Request = axios
        this.apiUrl = `https://api.idpay.ir/${version}/`
    }

    /**
    * @param {Boolean} sandbox Enable Sandbox or not
    * @returns {IDPayHeader}
    * @private
    */
    private GetHeader(sandbox = false)
    {
        return {
            'X-API-KEY': this.token,
            'X-SANDBOX': sandbox ?? false
        };
    }

    /**
    * Create a Payment
    * @param {string} id ID of Order/Payment - 50 Length at the Must
    * @param {number} amount Money Amount that you want in IRR (Rial)
    * @param {IDPayTypes.Options} params Some Params that are optional
    * @returns {Promise<IDPayTypes.CreatePaymentSucces>} Whatver the axios would return
    */
    async CreatePayment(id: string, amount: number, params: IDPayTypes.Options): Promise<IDPayTypes.CreatePaymentSucces>
    {

        if(!id || id == '' || id == ' ' || typeof id !== 'string' || id.length > 50)
            throw new Error(`ID is Invalid.`);

        if(!amount || typeof amount !== 'number' || amount == 0 || amount > 500000000 || amount < 1000)
            throw new Error(`Amount number is Invalid.`);

        const paymentObject: IDPayTypes.RequestOptions = {
            order_id: id,
            amount,
            name: params.name,
            callback: params.callback,
        };

        const sandBox = ('sandbox' in params && typeof params['sandbox'] == 'boolean') ? params['sandbox'] : false;

        try {
            const response = await this.Request.post<IDPayTypes.CreatePaymentSucces>(`/payment`, paymentObject, { headers: this.GetHeader(sandBox), baseURL: this.apiUrl });
            const data = response.data
            if('error_code' in data)
                throw new Error(`IDPay Error: ${data.error_code} - ${data.error_message}`);

            return data;
        } catch (error) {
            const e: AxiosError<IDPayTypes.IDPayError> = error as AxiosError<IDPayTypes.IDPayError>
            throw new Error(`IDPay Error: ${e.response.data.error_code} - ${e.response.data.error_message}`);
        }
    }

    /**
    * Verify a Created Payment (or the Callback)
    * @param {string} recivedID ID That you recived after Creating a payment with `CreatePayment` Method
    * @param {string} createdID ID That you sent for Creating a Payment with `CreatePayment` Method
    * @param {boolean} sandBox Send The Request as a SandBox Request
    * @returns {Promise<IDPayTypes.VerifyPaymentSucces>} Whatver the axios would return
    */
    async VerifyPayment(recivedID: string, createdID: string, sandBox = false): Promise<IDPayTypes.VerifyPaymentSucces>
    {

        if(!recivedID || typeof recivedID !== 'string')
            throw new Error(`RecivedID is invalid.`);
        if(!createdID || typeof createdID !== 'string')
            throw new Error(`CreatedID is invalid.`);

        try {
            const response = await this.Request.post<IDPayTypes.VerifyPaymentSucces>(`/payment/verify`, { id: recivedID, order_id: createdID }, { headers: this.GetHeader(sandBox), baseURL: this.apiUrl })
            const data = response.data

            if('error_code' in data)
                throw new Error(`IDPay Error: ${data.error_code} - ${data.error_message}`);
        
            return data;
        } catch (error) {
            const e: AxiosError<IDPayTypes.IDPayError> = error as AxiosError<IDPayTypes.IDPayError>
            throw new Error(`IDPay Error: ${e.response.data.error_code} - ${e.response.data.error_message}`);
        }
    }

    /**
    * Get Status of a Created Payment
    * @param {string} recivedID ID That you recived after Creating a payment with `CreatePayment` Method
    * @param {string} createdID ID That you sent for Creating a Payment with `CreatePayment` Method
    * @param {boolean} sandBox Send The Request as a SandBox Request
    * @returns {Promise<unknown>} Whatver the axios would return
    */
    async PaymentStatus(recivedID: string, createdID: string, sandBox = false): Promise<IDPayTypes.PaymentStatusSuccess>
    {

        if(!recivedID || typeof recivedID !== 'string')
            throw new Error(`RecivedID is invalid.`);
        if(!createdID || typeof createdID !== 'string')
            throw new Error(`CreatedID is invalid.`);

        try {
            const response = await this.Request.post(`/payment/inquiry`, {
                    id: recivedID,
                    order_id: createdID
                },
                {
                    headers: this.GetHeader(sandBox),
                    baseURL: this.apiUrl
                });
            const data = response.data

            return data;
        } catch (error) {
            const e: AxiosError<IDPayTypes.IDPayError> = error as AxiosError<IDPayTypes.IDPayError>
            throw new Error(`IDPay Error: ${e.response.data.error_code} - ${e.response.data.error_message} - ${this.GetError(e.response.status.toString(), e.response.data.error_code.toString())}`);
        }
    }

    /**
    * Get Transaction Message by Code
    * @param {string} code Transaction Code
    * @returns {string} Message in Persian
    */
    GetMessage(code: string)
    {
        return this.TransactionCodes[code as keyof typeof this.TransactionCodes];
    }

    /**
    * Get Error Message
    * @param {string} statusCode StatusCode that would be in the Response Header (such as 200, 404, ....)
    * @param {string} errorCode Error code that you would recive in the callback from IDPay (a random number)
    * @returns {string} Message in Persian
    */
    GetError(statusCode: string, errorCode: string)
    {
        // eslint-disable-next-line
        // @ts-ignore
        return this.Errors[statusCode as keyof typeof this.Errors][errorCode as keyof typeof this.Errors];
    }
}