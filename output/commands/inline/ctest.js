"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _library_1 = require("../../library");
const command = {
    name: "test",
    description: "Tests the time delay",
    searchCriteria: ["test", "testing", "ping"],
    execute: (message) => {
        // get current time
        const timeMs = new Date().getMilliseconds();
        // get date message sent in ms
        const timeMessageMs = message.createdAt.getMilliseconds();
        const embed = new _library_1.MyEmbedBuilder()
            .setTitle(`Test`)
            .setDescription(`Response time: ${Math.abs(timeMessageMs - timeMs)}ms`);
        message.channel.send({ embeds: [embed] });
    },
};
exports.default = command;
//# sourceMappingURL=ctest.js.map