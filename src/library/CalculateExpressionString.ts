const debug = require("debug")("library:CalculateExpressionString");
const evaluatex = require("evaluatex");

const units: Map<string, number> = new Map([ 
    ["k", 3], 
    ['m', 6],
    ['b', 9],
    ['t', 12],
]);

function replaceUnit(match: string, p1: string, p2: string){
    debug(`match: ${match} | p1: ${p1} | p2: ${p2}`);

    for(const [unit, num] of units){
        if(p2 === unit)
            return `(${p1} * 1${"0".repeat(num)})`;
    }
    return match;
}

function replaceFunction(_: string, p1: string, p2: string){
    switch(p1){
        case 'sum': return `(${p2.replaceAll(',', '+')})`;
        case 'multiply':
        case 'mult': return `(${p2.replaceAll(',', '*')})`;
        case 'subtract': 
        case 'sub': return `(${p2.replaceAll(',', '-')})`;
        default: return "";
    }
}

function replaceZeroWithUnit(num: number){
    // count the number of zeros
    let count = 0;
    for(; num % 10 === 0 && num > 0; ++count)
        num /= 10;

    if((count + 1) % 3 === 0 && num > 10){
        num /= 10;
        ++count;
    }

    let res = "";
    for(const [k, v] of units){
        if(count === v){
            res = `${num}${k}`;
            break;
        }
        else if(count % 3 > 0 && count - (count % 3) === v){
            res = `${num}${"0".repeat(count % 3)}${k}`;
            break;
        }
    }

    if(res === "")
        res = `${num}`;

    return res;
}

type V = ((match: string, p1: string, p2: string) => string) | ((match: string, p1: string) => string) | string

// here's the character that will be replaced
const replaceable = new Map<RegExp | string, V>([
    [/(\d*\.?\d*)(\w)/g, replaceUnit], // change k, m, b, t to 000, 000000, 000000000, 000000000000
    [/(sum|mult|multiply|sub|subtract)\(([0-9,]*)\)/g, replaceFunction], // sum(1,2,3,1,2,3) -> (1+2+3+1+2+3)
    ['x', '*'],
    [/[÷|:]/g, '/'],
    ['%', '/100'],
    [/[v|√]\(?(\d+)\)?/g, 'sqrt($1)'], // turns v(25) or v25 into sqrt(25)
    [/sqrt(\d+)/g, 'sqrt($1)'], // turns sqrt25 into sqrt(25)
    [/(cos|sin|tan|asin|acos|atan)(\d+)/g, '$1($2 * PI / 180)'], // turns sin255 -> sin(255 * PI / 180)
]);

// interface CalculateExpressionStringOptions{
//     calculationPrecision?: number;
// }

export function calculateExpressionString(expression: string): number{
    let exp = expression;

    for(const [key, val] of replaceable){
        if(typeof val === "string"){
            exp = exp.replaceAll(key, val);
            debug(`replace ${key} with ${val} | expression: ${exp}`);
        }
        else{
            exp = exp.replaceAll(key, val);
            debug(`replace ${key} with ${val.name} | expression: ${exp}`);
        }
    }

    debug(`final expression: ${exp}`);
    let result = evaluatex(exp)() as unknown;

    if(typeof result !== "number")
        throw new Error("Error while evaluating the expression");

    return result;
}