import { INLINE_COMMAND_COLDOWN_TIME } from "@config";

const debugs = require("debug")("library:TemporaryArray");

/**
 * TemporaryArray is an array that the data will be deleted after a certain time
 */
export class TemporaryArray<_T> {
    private m_data: { data: _T, timeOut: NodeJS.Timeout }[] = [];
    private m_time: number;
    private m_isEqual: (a: _T, b: _T) => boolean;

    /**
     * 
     * @param data the data of each element
     * @param time time to delete the data (defaults to 10 seconds)
     */
    constructor(
        data: _T[] = [],
        isEqual: (a: _T, b: _T) => boolean,
        time: number = INLINE_COMMAND_COLDOWN_TIME * 1000
    ) {
        for(const d of data)
            this.addData(d);
        this.m_isEqual = isEqual;
        this.m_time = time;

        debugs(`created TemporaryArray with ${data.length} data that lasted for ${time}ms`);
    }

    // getters
    get data(): _T[] { return this.m_data.map(d => d.data); }
    get timeOut(): number { return this.m_time; }

    // methods
    addData(data: _T, timeoutms?: number): this {
        const timeOut = setTimeout(
            () => {
                this.m_data = this.m_data.filter((d) => !this.m_isEqual(d.data, data));
                debugs(`removed data from TemporaryArray, now has ${this.m_data.length} data`);
            }, timeoutms ?? this.m_time);
            
        this.m_data.push({ data, timeOut });

        debugs(`added data to TemporaryArray, now has ${this.m_data.length} data`);

        return this;
    }

    find(pred: (data: _T) => boolean): _T | undefined {
        return this.m_data.find((d) => pred(d.data))?.data;
    }

    removeData(data: _T): this {
        this.m_data = this.m_data.filter((d) => {
            if(this.m_isEqual(d.data, data)){
                clearTimeout(d.timeOut);
                return false;
            }
            return true;
        });

        return this;
    }
}