import {inlineCommandReturnTypes, MyEmbedBuilder} from "@library";

const command: inlineCommandReturnTypes = {
    name: "pika",
    description: "sends a response to pika",
    searchCriteria: ["pika"],
    execute: (message) => {
        message.channel.send("chu!");
    },
};

export default command;