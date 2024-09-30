"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFileImage = isFileImage;
exports.rngInt = rngInt;
exports.rng = rng;
exports.sleep = sleep;
exports.toOrdinal = toOrdinal;
const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
/**
 * check if the file name is an image
 * @param filename the filename of the image (including the extension)
 * @returns boolean whether the file is an image or not
 */
function isFileImage(filename) {
    const extension = filename.split(/[#?]/)[0].split('.').pop()?.trim();
    if (!extension)
        return false;
    return imageExtensions.includes(extension);
}
/**
 * returns a random integer between min and max (max included)
 * @param min minimum value (rounded down)
 * @param max maximum value (rounded up)
 * @returns number between min and max
 */
function rngInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (Math.abs(max - min) + 1)) + Math.min(min, max);
}
/**
 * returns a random number between min and max
 * @param min minimum value
 * @param max maximum value
 * @returns number between min and max
 */
function rng(min, max) {
    return Math.random() * Math.abs(max - min) + Math.min(max, min);
}
/**
 * sleeps for a given amount of time (async function)
 * @param ms time in milliseconds
 * @returns void
 */
async function sleep(ms) {
    return new Promise((res, _) => {
        setTimeout(() => { res(); }, ms);
    });
}
/**
 * converts a number to ordinal form
 * @example
 * toOrdinal(1) // 1st
 * toOrdinal(2) // 2nd
 * @param n number to convert
 * @returns string ordinal form of the number
 */
function toOrdinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
//# sourceMappingURL=BasicFunctions.js.map