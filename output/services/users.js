"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const _library_1 = require("../library");
const _models_1 = require("../models");
class UserService {
    static async getUser(userid) {
        const find = await UserService.service.get(userid);
        if (!find)
            throw new Error("User not found");
        return find;
    }
    static async getAllUsers() {
        const find = await UserService.service.getAll();
        return find;
    }
    static async setUserRole(userid, role) {
        // find the user by id
        const user = await UserService.service.get(userid);
        if (!user)
            throw new Error("User not found");
        await UserService.service.update(userid, { ...user, rolename: role });
    }
    static async deleteUser(userid) {
        await UserService.service.delete(userid);
    }
    static findUser(pred) {
        return UserService.service.getWhere(pred);
    }
    static async createUser(user) {
        return await UserService.service.add(user);
    }
    static async userIsAdmin(discordId) {
        try {
            const user = await UserService.service.get(discordId);
            if (!user)
                throw new Error("User not found");
            switch (user.rolename) {
                case "admin":
                case "vice":
                case "owner":
                    return true;
                default:
                    return false;
            }
        }
        catch (e) {
            return false;
        }
    }
}
exports.UserService = UserService;
UserService.dbName = "users_view";
UserService.service = new _library_1.ServiceSupabase("id", UserService.dbName, {
    typeGuard: _models_1.isUser
});
//# sourceMappingURL=users.js.map