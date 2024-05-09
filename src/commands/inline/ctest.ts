import {inlineCommandReturnTypes, MyEmbedBuilder} from "@library";

const command: inlineCommandReturnTypes = {
    name: "test",
    description: "Tests the time delay",
    searchCriteria: ["test", "testing", "ping"],
    execute: (message) => {
            // get current time
            const timeMs = new Date().getMilliseconds();
        
            // get date message sent in ms
            const timeMessageMs = message.createdAt.getMilliseconds();
            
            const embed = new MyEmbedBuilder()
                .setTitle(`Test`)
                .setDescription(`Response time: ${Math.abs(timeMessageMs -  timeMs)}ms`);

            message.channel.send({embeds: [embed]});
    },
};

export default command;