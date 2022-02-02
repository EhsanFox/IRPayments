import { Engines } from "./Engines/index.js";
import { EngineBase } from "./Structers/EngineBase.js";
import { RequestHandler } from "./Structers/Request.js";
const { IDPay } = Engines;
const Util = {
    RequestHandler,
    EngineStructer: EngineBase
}

export {
    Engines,
    Util,
}