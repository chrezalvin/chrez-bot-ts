import { rngInt } from "@modules/basicFunctions";


export interface SessionStore_t<_T>{
    key: string,
    dateExpired: number;
    value: _T
}

export interface Options{
    expirationTime: number;
}

export function generateRandomString() {
    let randomString = '';
    const randomNumber = rngInt(0, 10);
  
    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + rngInt(0, 93));
    }
  
    return randomString;
}

export class SessionStore<_T>{
    private m_arr: SessionStore_t<_T>[] = [];
    public m_expirationTIme = 60 * 60; // defaults to 1 hour

    constructor(opt?: Options){
        if(opt){
            this.m_expirationTIme = opt.expirationTime;
        }
    }

    has(key: string){
        return this.m_arr.find(arr => arr.key === key) !== undefined;
    }

    get(key: string){
        return this.m_arr.find(arr => arr.key === key);
    }

    add(value: _T, key?: string){
        const SESSION_KEY = key ?? generateRandomString();
        if(key){
            if(this.has(key)){
                this.replace(SESSION_KEY, value);
            }
            else{
                this.m_arr.push({
                    key: SESSION_KEY, 
                    value, 
                    dateExpired: new Date().getTime() + this.m_expirationTIme
                });
            }
        }
        else{
            this.m_arr.push({
                key: SESSION_KEY, 
                value, 
                dateExpired: new Date().getTime() + this.m_expirationTIme
            });
        }

        return SESSION_KEY;
    }

    replace(key: string, value: _T){
        const idx = this.m_arr.findIndex((arr) => arr.key === key);
        if(idx === -1) return false;

        this.m_arr[idx] = {...this.m_arr[idx], value};
        return true;
    }

    delete(key: string){
        const idx = this.m_arr.findIndex((arr) => arr.key === key);
        if(idx === -1) return false;

        return this.m_arr.splice(idx) !== undefined;
    }

    isExpired(key: string){
        const get = this.get(key);
        if(!get) return false;
        else return (get.dateExpired - (new Date()).getTime()) < 0;
    }
}

export default SessionStore;