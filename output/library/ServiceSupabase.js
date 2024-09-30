"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceSupabase = void 0;
const debug = require("debug")("Server:Service");
const _config_1 = require("../config");
/**
 * Service class to handle the database operation, this class will cache the data to reduce the payload
 */
class ServiceSupabase {
    // getter
    /**
     * the name of the table
     */
    get tableName() { return this.m_tableName; }
    /**
     * the key name from the table's column
     */
    get keyName() { return this.m_keyName; }
    /**
     * the supabase's client
     */
    get client() { return _config_1.supabase.from(this.m_tableName); }
    /**
     * the cached data in array form, it's supposed to return the full data in the database
     */
    get cache() {
        const res = [];
        for (const [_, data] of this.m_cache)
            res.push(data);
        return res;
    }
    /**
     * the length of the cached data
     */
    get length() { return this.m_cache.size; }
    /**
     * creates a new service class
     * @param keyName the unique key from the table
     * @param tableName supabase table name
     * @param option optional typeguard to check the data type, if not set, it will assume the data is already _T[]
     */
    constructor(keyName, tableName, option) {
        this.m_cache = new Map();
        this.m_keyName = keyName;
        this.m_tableName = tableName;
        this.m_typeGuard = option.typeGuard;
        this.getAll()
            .then(() => debug(`Service class created with key: ${this.m_keyName.toString()} and table: ${this.m_tableName}`))
            .catch(err => debug(`Service class created with key: ${this.m_keyName.toString()} and table: ${this.m_tableName}, error: ${err}`));
        debug(`Service class created with key: ${this.m_keyName.toString()} and table: ${this.m_tableName}`);
        ServiceSupabase.s_services.push(this);
    }
    /**
     * get all the data from supabase, ignoring the cache
     * this function will also resets the cache to empty
     * @returns the data in array format
     */
    async getAll() {
        const res = await _config_1.supabase.from(this.m_tableName).select("*");
        if (res.error)
            throw new Error(res.error.message);
        // filter the data based on the typeguard
        const data = (this.m_typeGuard ? res.data.filter(ele => this.m_typeGuard?.(ele)) : res.data);
        // reset cache
        this.m_cache.clear();
        // then fill the cache with the retrieved data
        for (const item of data)
            this.m_cache.set(item[this.m_keyName], item);
        return data;
    }
    /**
     * Get data based on the key, if the data is not found in the cache, it will fetch the data from the database
     * @param key the key to search
     * @returns the data that matches the key, undefined if not found
     */
    async get(key) {
        // search on the cache first
        const item = this.m_cache.get(key);
        if (item)
            return item;
        else {
            // if not found, search on the database
            const res = await _config_1.supabase.from(this.m_tableName).select("*").eq(this.m_keyName, key);
            if (res.error)
                throw new Error(res.error.message);
            // if the data is found, add it to the cache
            if (res.data.length !== 0) {
                const data = res.data[0];
                this.m_cache.set(data[this.m_keyName], data);
                return data;
            }
        }
    }
    /**
     * Insert a new data into database and updates the cache, will return false if the insert fail
     * @param value data to be inserted, without the key
     * @param keyValue optional key value, if not set, it will use the key from the value
     */
    async add(value, keyValue) {
        // remove the key from the value since key is permanent
        const data = keyValue ? { ...value, [this.m_keyName]: keyValue } : value;
        const res = await _config_1.supabase
            .from(this.m_tableName)
            .insert(data)
            .select();
        if (res.error)
            throw new Error(res.error.message);
        const returnedData = res.data[0];
        if (this.m_typeGuard && this.m_typeGuard(returnedData)) {
            this.m_cache.set(returnedData[this.m_keyName], returnedData);
            return returnedData;
        }
        else
            return undefined;
    }
    /**
     * get data based on pred, this function will only search the data within the cache
     * @param pred the search function
     * @returns data that matches the pred
     */
    getWhere(pred) {
        const res = [];
        for (const [_, data] of this.m_cache)
            if (pred(data))
                res.push(data);
        return res;
    }
    /**
     * Updates the data in the database, also updates the one in cache
     *
     * if the data is not found in the database, it will throw an error
     *
     * if the data is not found in the cache, it will still attempt to update the data in the database and add it to the cache if the update is successful
     * @param key
     * @param value
     */
    async update(key, value) {
        const res = await _config_1.supabase
            .from(this.m_tableName)
            .update(value)
            .eq(this.m_keyName, key)
            .select();
        if (res.error)
            throw new Error(res.error.message);
        const data = res.data[0];
        if (this.m_typeGuard && this.m_typeGuard(data)) {
            this.m_cache.set(key, data);
            return data;
        }
        else
            return undefined;
    }
    /**
     * deletes the data from the database based on the key, also deletes the data from the cache
     * @param key
     * @returns
     */
    async delete(key) {
        const res = await _config_1.supabase
            .from(this.m_tableName)
            .delete()
            .eq(this.m_keyName, key);
        if (!res.error)
            this.m_cache.delete(key);
        return res.error?.message;
    }
}
exports.ServiceSupabase = ServiceSupabase;
ServiceSupabase.s_services = [];
exports.default = ServiceSupabase;
//# sourceMappingURL=ServiceSupabase.js.map