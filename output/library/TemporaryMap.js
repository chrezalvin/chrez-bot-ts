"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemporaryMap = void 0;
const _config_1 = require("../config");
const debug = require("debug")("ChrezBot:TemporaryArray");
/**
 * TemporaryMap is a map that the data will be deleted after a certain time
 */
class TemporaryMap {
    /**
     * @param data the data of each element
     * @param time time to delete the data in ms (defaults to 10 seconds)
     */
    constructor(time = _config_1.inline_command_coldown_time * 1000, data) {
        this.m_data = new Map();
        this.m_time = time;
        if (data)
            for (const [k, v] of data)
                this.addData(k, v);
        debug(`created TemporaryArray with ${this.m_data.size} data that lasted for ${time}ms`);
    }
    // getters
    get data() { return this.m_data; }
    get timeOut() { return this.m_time; }
    // methods
    /**
     * adds a new data that will be removed after a certain time
     * @param key the map key
     * @param value the map value
     * @param timeoutms time to delete the data in ms (defaults to 10 seconds or the time set in the constructor)
     * @returns this
     */
    addData(key, value, timeoutms) {
        this.m_data.set(key, value);
        setTimeout(() => {
            if (this.m_data.delete(key))
                debug(`removed data ${key} from TemporaryMap, now has ${this.m_data.size} data`);
            else
                debug(`attempted to remove data ${key} from TemporaryMap, but the data is not found, now has ${this.m_data.size} data`);
        }, timeoutms ?? this.m_time);
        debug(`added data to TemporaryMap, now has ${this.m_data.size} data`);
        return this;
    }
    /**
     * removes the data from the map
     * @param key the map key
     * @returns this
     */
    removeData(key) {
        this.m_data.delete(key);
        debug(`removed data ${key} from TemporaryMap, now has ${this.m_data.size} data`);
        return this;
    }
    get(key) {
        return this.m_data.get(key);
    }
}
exports.TemporaryMap = TemporaryMap;
//# sourceMappingURL=TemporaryMap.js.map