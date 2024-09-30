"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionStore = exports.generateRandomString = void 0;
const basicFunctions_1 = require("./basicFunctions");
function generateRandomString() {
    let randomString = '';
    const randomNumber = (0, basicFunctions_1.rngInt)(0, 10);
    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + (0, basicFunctions_1.rngInt)(0, 93));
    }
    return randomString;
}
exports.generateRandomString = generateRandomString;
class SessionStore {
    constructor(opt) {
        this.m_arr = [];
        this.m_expirationTIme = 60 * 60; // defaults to 1 hour
        if (opt) {
            this.m_expirationTIme = opt.expirationTime;
        }
    }
    has(key) {
        return this.m_arr.find(arr => arr.key === key) !== undefined;
    }
    get(key) {
        return this.m_arr.find(arr => arr.key === key);
    }
    add(value, key) {
        const SESSION_KEY = key ?? generateRandomString();
        if (key) {
            if (this.has(key)) {
                this.replace(SESSION_KEY, value);
            }
            else {
                this.m_arr.push({
                    key: SESSION_KEY,
                    value,
                    dateExpired: new Date().getTime() + this.m_expirationTIme
                });
            }
        }
        else {
            this.m_arr.push({
                key: SESSION_KEY,
                value,
                dateExpired: new Date().getTime() + this.m_expirationTIme
            });
        }
        return SESSION_KEY;
    }
    replace(key, value) {
        const idx = this.m_arr.findIndex((arr) => arr.key === key);
        if (idx === -1)
            return false;
        this.m_arr[idx] = { ...this.m_arr[idx], value };
        return true;
    }
    delete(key) {
        const idx = this.m_arr.findIndex((arr) => arr.key === key);
        if (idx === -1)
            return false;
        return this.m_arr.splice(idx) !== undefined;
    }
    isExpired(key) {
        const get = this.get(key);
        if (!get)
            return false;
        else
            return (get.dateExpired - (new Date()).getTime()) < 0;
    }
}
exports.SessionStore = SessionStore;
exports.default = SessionStore;
