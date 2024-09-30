"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cause = exports.isDiscordAPIError = exports.importModule = exports.isChatInputCommandInteraction = exports.isDiscordMessage = exports.CommandReturnTypesChecking = exports.isInline = exports.isCommandReturnType = void 0;
function isCommand(command) {
    if (typeof command !== "object" || !command)
        return false;
    if (!("name" in command) || typeof command.name !== "string")
        return false;
    if (!("description" in command) || typeof command.description !== "string")
        return false;
    if (!("execute" in command) || typeof command.execute !== "function")
        return false;
    return true;
}
function isCommandReturnType(command) {
    if (!isCommand(command))
        return false;
    return true;
}
exports.isCommandReturnType = isCommandReturnType;
function isInline(command) {
    if (!isCommand(command))
        return false;
    if (!("searchCriteria" in command))
        return false;
    if (!Array.isArray(command.searchCriteria))
        return false;
    for (const search of command.searchCriteria) {
        if (typeof search !== "string")
            if (typeof search !== "object" || !(search instanceof RegExp))
                return false;
    }
    return true;
}
exports.isInline = isInline;
function CommandReturnTypesChecking(obj) {
    if (typeof obj === "object") {
        const keys = ["name", "description", "execute"];
        for (const objKey of Object.keys(obj))
            if (keys.find((key) => key === objKey) === undefined)
                return false;
    }
    return true;
}
exports.CommandReturnTypesChecking = CommandReturnTypesChecking;
/**
 * (Not recomended)
 * typecheck for Message<boolean>
 * @param val
 * @returns
 */
function isDiscordMessage(val) {
    if (typeof val !== "object" || val === null)
        return false;
    if ("channel" in val)
        if (val.channel !== null && typeof val.channel === "object")
            if ("send" in val.channel)
                return val.channel.send instanceof Function;
    return false;
}
exports.isDiscordMessage = isDiscordMessage;
/**
 * typecheck for Interaction
 * @param val
 * @returns
 */
function isChatInputCommandInteraction(val) {
    if (typeof val !== "object" || val === null)
        return false;
    if ("isChatInputCommand" in val)
        if (val.isChatInputCommand instanceof Function)
            if (typeof val.isChatInputCommand() === "boolean")
                return val.isChatInputCommand();
    return false;
}
exports.isChatInputCommandInteraction = isChatInputCommandInteraction;
async function importModule(path, ensureType) {
    let imported = await (_a = `/${path}`, Promise.resolve().then(() => __importStar(require(_a))));
    if (imported != undefined && typeof imported === "object")
        if ('default' in imported) {
            imported = imported.default;
        }
        else
            throw new Error(`Cannot found module default in the module ${path}`);
    else
        throw new Error("Cannot find the module");
    if (!ensureType)
        return imported;
    else if (ensureType && ensureType(imported))
        return imported;
    else
        throw new Error("imported path is not the expected type");
}
exports.importModule = importModule;
function isDiscordAPIError(val) {
    if (typeof val === "object" && val !== null)
        if ("code" in val)
            if ("status" in val)
                if ("message" in val)
                    if ("rawError" in val)
                        return typeof val.rawError === "object";
    return false;
}
exports.isDiscordAPIError = isDiscordAPIError;
/**
 * return type for functions that can return error
 */
class Cause {
    static isCause(val) {
        if (typeof val === "object" && val !== null)
            if ("ok" in val)
                if ("message" in val)
                    return typeof val.ok === "boolean" && typeof val.message === "string";
        return false;
    }
    constructor(ok = true, message = "") {
        this.ok = ok;
        this.message = message;
    }
}
exports.Cause = Cause;
