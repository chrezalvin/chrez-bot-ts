const debug = require("debug")("library:middlewareEngine");

// export type MiddlewareFunction<_T> = (ctx: _T, next: (err?: any) => void) => Promise<void>;
// export function middlewareEngine<_T>(...middleware: MiddlewareFunction<_T>[]){
//     return function dispatch(ctx: _T): Promise<void>{
//         let index = -1;

//         function runFrom(idx: number, err?: any): Promise<void>{
//             if(idx <= index)
//                 throw new Error("next() is called multiple times!");

//             index = idx;

//             const fn = middleware[idx];

//             if(!fn)
//                 return Promise.resolve();

//             return Promise.resolve(fn(ctx, (err) => {
//                 runFrom(idx + 1, err)
//             }));
//         }

//         return runFrom(0);
//     }
// }

export type MiddlewareFunction<_T> = (ctx: _T, next: (err?: any) => void) => Promise<void>;
export type MiddlewareErrorFunction<_T> = (ctx: _T, next: (err?: any) => void, error?: any) => Promise<void>;
export function middlewareEngine<_T>(...middleware: ((ctx: _T, next: (err?: any) => void, error?: any) => Promise<void>)[]){
    return function dispatch(ctx: _T): Promise<void>{
        let index = -1;
        let error: any = undefined;

        async function runFrom(idx: number): Promise<void>{
            if(idx <= index)
                throw new Error("next() is called multiple times!");

            index = idx;

            const fn = middleware[idx];

            if(!fn)
                return;

            if(error && fn.length !== 3)
                return runFrom(idx + 1);

            debug(`chain #${idx}. ${fn.name}`);
             
            try{
                await fn(ctx, (err) => {
                    if(err)
                        error = err;
                    
                    runFrom(idx + 1)
                }, error);
            }
            catch(err){
                error = err;
                return runFrom(idx + 1);
            }
        }

        return runFrom(0);
    }
}

export type ErrorMiddlewareFunction<_T> = (error: any, ctx: _T, next: () => void) => Promise<void>;
export function errorMiddlewareEngine<_T>(...middleware: ErrorMiddlewareFunction<_T>[]){
    return function dispatch(error: any, ctx: _T): Promise<void>{
        let index = -1;

        function runFrom(idx: number): Promise<void>{
            if(idx <= index)
                throw new Error("next() is called multiple times!");

            index = idx;

            const fn = middleware[idx];

            if(!fn)
                return Promise.resolve();

            return Promise.resolve(fn(error, ctx, () => runFrom(idx + 1)));
        }

        return runFrom(0);
    }
}