
export class EngineBase {
    
    /**
     * Engine Name
     * @type {String}
     */
    name;

    /**
     * @param {String} name Engine Name
     */
    constructor(name)
    {
        if(!name)
            this.name = "";

        this.CreatePayment = () => new Error("This Engine is not setup properly.");
        this.VerifyPayment = () => new Error("This Engine is not setup properly.");
        this.GetHeader = () => new Error("This Engine is not setup properly.");
        this.GetError = () => new Error("This Engine is not setup properly.");
        this.Errors = {};
    }

    
}