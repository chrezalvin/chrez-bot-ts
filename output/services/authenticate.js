"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestOauth2 = requestOauth2;
exports.collectUserData = collectUserData;
exports.isAPIUser = isAPIUser;
const debug = require("debug")("Server:authenticate");
const _config_1 = require("../config");
const undici_1 = require("undici");
async function requestOauth2(opt) {
    const tokenResponseData = await (0, undici_1.request)('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: new URLSearchParams({
            ...opt,
            client_id: _config_1.CLIENT_ID,
            client_secret: _config_1.CLIENT_SECRET,
            grant_type: 'authorization_code',
        }).toString(),
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        }
    });
    if (tokenResponseData.statusCode === 400) {
        const errorJson = await tokenResponseData.body.json();
        if (typeof errorJson === "object" && errorJson !== null && "error" in errorJson)
            debug(`Statuscode 400 error given, reason: ${errorJson.error ?? "no reason found"}`);
        else
            debug(`Statuscode 400 error given, reason: ${errorJson ?? "no reason found"}`);
        throw errorJson;
    }
    const res = await tokenResponseData.body.json();
    return res;
}
async function collectUserData(opt) {
    debug(`received a userdata ${opt}`);
    const userResult = await (0, undici_1.request)('https://discord.com/api/users/@me', {
        headers: {
            authorization: `${opt.token_type} ${opt.access_token}`,
        },
    });
    if (userResult.statusCode === 400) {
        const errorJson = await userResult.body.json();
        if (typeof errorJson === "object" && errorJson !== null && "error" in errorJson)
            debug(`Statuscode 400 error given, reason: ${errorJson.error ?? "no reason found"}`);
        else
            debug(`Statuscode 400 error given, reason: ${errorJson ?? "no reason found"}`);
        throw errorJson;
    }
    const user = await userResult.body.json();
    if (isAPIUser(user))
        return user;
    else
        throw new Error("Couldnt find user");
}
function isAPIUser(val) {
    if (val === null || typeof val !== "object")
        return false;
    if ("accent_color" in val)
        if ("avatar" in val)
            if ("discriminator" in val && typeof val.discriminator === "string")
                if ("id" in val && typeof val.id === "string")
                    if ("username" in val && typeof val.username === "string")
                        return true;
    return false;
}
//# sourceMappingURL=authenticate.js.map