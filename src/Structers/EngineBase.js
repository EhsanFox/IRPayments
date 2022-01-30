
export class EngineBase {
    
    /**
     * Engine Name
     * @type {String}
     */
    name;

    constructor(name)
    {
        if(!name)
            this.name = "";

        this.CreatePayment = () => new Error("This Engine is not setup properly.");
        this.VerifyPayment = () => new Error("This Engine is not setup properly.");
        this.PaymentStatus = () => new Error("This Engine is not setup properly.");
        this.Transactions = () => new Error("This Engine is not setup properly.");
        this.GetHeader = () => new Error("This Engine is not setup properly.");
        this.GetError = () => new Error("This Engine is not setup properly.");
        this.GetMessage = () => new Error("This Engine is not setup properly.");
        this.Errors = {};
        this.TransactionCodes = {};
    }

    
}