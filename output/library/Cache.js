"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
class Cache {
    // private m_tableName: string;
    constructor(keyName, tableName) {
        this.m_cache = new Map();
        this.m_keyname = keyName;
    }
    get(key) {
        const item = this.m_cache.get(key);
        console.log(`searching for key: ${key}, found: ${typeof item}`);
        return item;
    }
    /**
     * updates data in the cache, does not create a new cache if the key is not found
     * @param key the key of the cache
     * @param value the value to update
     */
    update(key, value) {
        const elem = this.m_cache.get(key);
        if (elem)
            this.m_cache.set(key, {
                ...elem,
                ...value,
            });
        console.log(`set cache with key: ${key}, value: ${typeof value}`);
    }
    /**
     * adds a new data to the cache, will throw an error if the key already exist
     * @param key
     * @param value
     */
    add(key, value) {
        // make sure the key is not already in the cache
        if (this.m_cache.has(key))
            throw new Error(`key: ${key} already exist in the cache`);
        this.m_cache.set(key, value);
        console.log(`added cache with key: ${key}, value: ${typeof value}`);
    }
    /**
     * removes a data from the cache based on key
     * @param key
     */
    delete(key) {
        return this.m_cache.delete(key);
    }
    /**
     * resets the cache to empty state
     */
    reset() {
        this.m_cache.clear();
    }
}
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map