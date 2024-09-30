"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileByID = getProfileByID;
exports.getProfileByName = getProfileByName;
exports.userIsAdmin = userIsAdmin;
const profiles_json_1 = __importDefault(require("../assets/data/profiles.json"));
/**
 * get a guild member by id, alot faster than by name
 * @param discordID user's discord ID
 * @returns Profile or null
 */
function getProfileByID(discordID) {
    const find = profiles_json_1.default.find(profile => discordID === profile.discordID) ?? null;
    return find;
}
/**
 * get a guild member by name or their aliases (slower than get by ID)
 * @param discordID user's name or alias (case insensitive)
 * @returns Profile or null
 */
function getProfileByName(name) {
    const find = profiles_json_1.default.find(profile => (profile.name === name.toLowerCase() || profile.alias.find(a => a === name.toLowerCase()))) ?? null;
    return find;
}
function userIsAdmin(discordID) {
    const find = getProfileByID(discordID);
    if (find)
        return find.isAdmin === true;
    return false;
}
//# sourceMappingURL=profiles.js.map