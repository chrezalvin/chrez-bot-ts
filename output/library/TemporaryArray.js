"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporaryArray = void 0;
const _config_1 = require("../config");
const debugs = require("debug")("ChrezBot:TemporaryArray");
/**
 * TemporaryArray is an array that the data will be deleted after a certain time
 */
class TemporaryArray {
    /**
     *
     * @param data the data of each element
     * @param time time to delete the data (defaults to 10 seconds)
     */
    constructor(data = [], isEqual, time = _config_1.inline_command_coldown_time * 1000) {
        this.m_data = [];
        for (const d of data)
            this.addData(d);
        this.m_isEqual = isEqual;
        this.m_time = time;
        debugs(`created TemporaryArray with ${data.length} data that lasted for ${time}ms`);
    }
    // getters
    get data() { return this.m_data.map(d => d.data); }
    get timeOut() { return this.m_time; }
    // methods
    addData(data, timeoutms) {
        const timeOut = setTimeout(() => {
            this.m_data = this.m_data.filter((d) => !this.m_isEqual(d.data, data));
            debugs(`removed data from TemporaryArray, now has ${this.m_data.length} data`);
        }, timeoutms ?? this.m_time);
        this.m_data.push({ data, timeOut });
        debugs(`added data to TemporaryArray, now has ${this.m_data.length} data`);
        return this;
    }
    find(pred) {
        return this.m_data.find((d) => pred(d.data))?.data;
    }
    removeData(data) {
        this.m_data = this.m_data.filter((d) => {
            if (this.m_isEqual(d.data, data)) {
                clearTimeout(d.timeOut);
                return false;
            }
            return true;
        });
        return this;
    }
}
exports.TemporaryArray = TemporaryArray;
//# sourceMappingURL=TemporaryArray.js.map