const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];

/**
 * check if the file name is an image
 * @param filename the filename of the image (including the extension)
 * @returns boolean whether the file is an image or not
 */
export function isFileImage(filename: string): boolean{
    const extension = filename.split(/[#?]/)[0].split('.').pop()?.trim();
    if(!extension) return false;

    return imageExtensions.includes(extension);
}

/**
 * returns a random integer between min and max (max included)
 * @param min minimum value (rounded down)
 * @param max maximum value (rounded up)
 * @returns number between min and max
 */
export function rngInt(min: number, max: number){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (Math.abs(max - min) + 1)) + Math.min(min, max);
}

/**
 * returns a random element from an array, or undefined if the array is empty
 * @param arr array to get random element from
 * @returns random element from the array, or undefined if the array is empty
 */
export function rngArray<T>(arr: T[]): T | undefined{
    if(arr.length === 0) return undefined;
    
    return arr[rngInt(0, arr.length - 1)];
}

/**
 * returns a random number between min and max
 * @param min minimum value
 * @param max maximum value
 * @returns number between min and max
 */
export function rng(min: number, max: number){
    return Math.random() * Math.abs(max - min) + Math.min(max, min);
}

/**
 * sleeps for a given amount of time (async function)
 * @param ms time in milliseconds
 * @returns void
 */
export async function sleep(ms: number){
    return new Promise<void>((res, _) => {
        setTimeout(() => {res()}, ms);
    })
}

/**
 * converts a number to ordinal form
 * @example
 * toOrdinal(1) // 1st
 * toOrdinal(2) // 2nd
 * @param n number to convert
 * @returns string ordinal form of the number
 */
export function toOrdinal(n: number): string{
    const s = ["th", "st", "nd", "rd"],
    v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
