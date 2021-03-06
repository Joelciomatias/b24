"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise");
const qs = require("qs");
const auth_1 = require("./auth");
class Bitrix24 {
    /**
     * Create Bitrix Client
     * @param init Configuration Initializer
     */
    constructor(init) {
        this.init = init;
        if (init.config.host.indexOf('.') == -1) {
            init.config.host = `http://${init.config.host}.bitrix24.com`;
        }
        if (init.config.mode != undefined) {
            if ((init.config.mode != 'api') && (init.config.mode != "webhook")) {
                throw Error("Mode not supported");
            }
        }
        else {
            init.config.mode = "api";
        }
        if (!init.config.mode || init.config.mode == "api") {
            this.auth = new auth_1.default(init);
        }
    }
    /**
     * Call Bitrix rest API
     * @param {string} method - Method that will be called
     * @param {Object} param - Parameter and field that will send to API
     * @return {Promise} Return as object
     */
    callMethod(method, param = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let url;
            if (this.init.config.mode == "api") {
                //FIX ME: This implementation always refresh token before request, please fix it
                const token = yield this.auth.refreshToken();
                param['auth'] = token.access_token;
                url = `${this.init.config.host}/rest/${method}?${qs.stringify(param)}`;
            }
            else {
                url = `${this.init.config.host}/rest/${this.init.config.user_id}/${this.init.config.code}/${method}?${qs.stringify(param)}`;
            }
            const result = yield request.get(url);
            return JSON.parse(result);
        });
    }
}
exports.Bitrix24 = Bitrix24;
