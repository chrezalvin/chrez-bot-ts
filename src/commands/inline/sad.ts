import {InlineCommandReturnTypes} from "@library";

const command: InlineCommandReturnTypes = {
    name: "sad",
    description: "Unsad people",
    searchCriteria: [/^don'?t be sad/i],
    execute: async (message) => {
        await message.channel.send("sad backwards is das and");
        await message.channel.send("das not good");
    },
};

export default command;