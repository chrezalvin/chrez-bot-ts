"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;
exports.updateUserRole = updateUserRole;
const users_1 = require("../../services/users");
async function getUserById(req, res, next) {
    const id = req.params.userid;
    if (typeof id === "string") {
        const user = await users_1.UserService.getUser(id);
        res.json(user);
    }
}
function deleteUser(req, res, next) {
}
function updateUserRole(req, res, next) {
}
//# sourceMappingURL=user.js.map