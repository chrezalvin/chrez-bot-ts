import { inline_command_coldown_time } from "@config";

const debugs = require("debug")("ChrezBot:TemporaryArray");

/**
 * TemporaryArray is an array that the data will be deleted after a certain time
 */
export class TemporaryArray<_T> {
    private _data: { data: _T, timeOut: NodeJS.Timeout }[] = [];
    private _time: number;
    private _isEqual: (a: _T, b: _T) => boolean;

    /**
     * 
     * @param data the data of each element
     * @param time time to delete the data (defaults to 10 seconds)
     */
    constructor(
        data: _T[] = [],
        isEqual: (a: _T, b: _T) => boolean,
        time: number = inline_command_coldown_time * 1000
    ) {
        for(const d of data)
            this.addData(d);
        this._isEqual = isEqual;
        this._time = time;

        debugs(`created TemporaryArray with ${data.length} data that lasted for ${time}ms`);
    }

    // getters
    get data(): _T[] { return this._data.map(d => d.data); }
    get timeOut(): number { return this._time; }

    // methods
    addData(data: _T): this {
        const timeOut = setTimeout(
            () => {
                this._data = this._data.filter((d) => !this._isEqual(d.data, data));
                debugs(`removed data from TemporaryArray, now has ${this._data.length} data`);
            }, this._time
        )
        this._data.push({ data, timeOut });

        debugs(`added data to TemporaryArray, now has ${this._data.length} data`);

        return this;
    }

    find(pred: (data: _T) => boolean): _T | undefined {
        return this._data.find((d) => pred(d.data))?.data;
    }

    removeData(data: _T): this {
        this._data = this._data.filter((d) => {
            if(this._isEqual(d.data, data)){
                clearTimeout(d.timeOut);
                return false;
            }
            return true;
        });

        return this;
    }
}