import {InlineCommandReturnTypes, MyEmbedBuilder} from "@library";

const command: InlineCommandReturnTypes = {
    name: "pika",
    description: "sends a response to pika",
    searchCriteria: ["pika"],
    execute: (message) => {
        message.channel.send("chu!");
    },
};

export default command;