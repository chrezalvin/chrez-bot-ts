import { INLINE_COMMAND_COLDOWN_TIME } from "@config";

const debug = require("debug")("ChrezBot:TemporaryArray");

/**
 * TemporaryMap is a map that the data will be deleted after a certain time
 */
export class TemporaryMap<_K, _V> {
    private m_data: Map<_K, _V> = new Map();
    private m_time: number;

    /**
     * @param data the data of each element
     * @param time time to delete the data in ms (defaults to 10 seconds)
     */
    constructor(
        time: number = INLINE_COMMAND_COLDOWN_TIME * 1000,
        data?: Map<_K, _V>,
    ) {
        this.m_time = time;

        if(data)
            for(const [k, v] of data)
                this.addData(k, v);

        debug(`created TemporaryArray with ${this.m_data.size} data that lasted for ${time}ms`);
    }

    // getters
    get data(): Map<_K, _V> { return this.m_data; }
    get timeOut(): number { return this.m_time; }

    // methods
    /**
     * adds a new data that will be removed after a certain time
     * @param key the map key
     * @param value the map value
     * @param timeoutms time to delete the data in ms (defaults to 10 seconds or the time set in the constructor)
     * @returns this
     */
    addData(key: _K, value: _V, timeoutms?: number): this {
        this.m_data.set(key, value);
        setTimeout(() => {
            if(this.m_data.delete(key))
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
    removeData(key: _K): this {
        this.m_data.delete(key);

        debug(`removed data ${key} from TemporaryMap, now has ${this.m_data.size} data`);

        return this;
    }

    get(key: _K): _V | undefined {
        return this.m_data.get(key);
    }
}