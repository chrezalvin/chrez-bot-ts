import { inline_command_coldown_time } from "@config";

const debug = require("debug")("ChrezBot:TemporaryArray");

/**
 * TemporaryMap is a map that the data will be deleted after a certain time
 */
export class TemporaryMap<_K, _V> {
    private _data: Map<_K, _V> = new Map();
    private _time: number;

    /**
     * @param data the data of each element
     * @param time time to delete the data in ms (defaults to 10 seconds)
     */
    constructor(
        time: number = inline_command_coldown_time * 1000,
        data?: Map<_K, _V>,
    ) {
        this._time = time;
        
        if(data)
            for(const [k, v] of data)
                this.addData(k, v);

        debug(`created TemporaryArray with ${this._data.size} data that lasted for ${time}ms`);
    }

    // getters
    get data(): Map<_K, _V> { return this._data; }
    get timeOut(): number { return this._time; }

    // methods
    addData(key: _K, value: _V): this {
        this._data.set(key, value);
        setTimeout(() => {
            this._data.delete(key);
        }, this._time);

        debug(`added data to TemporaryMap, now has ${this._data.size} data`);

        return this;
    }

    removeData(key: _K): this {
        this._data.delete(key);

        debug(`removed data from TemporaryMap, now has ${this._data.size} data`);

        return this;
    }

    getData(key: _K): _V | undefined {
        return this._data.get(key);
    }
}