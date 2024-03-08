import { CommandBuilder, rngInt } from "@library";

const riceList = [
    "I like rice",
    "Rice is good",
    "Rice is nice",
    "Rice is life",
    "Rice is love",
    "Rice is everything",
]

const hello = new CommandBuilder<undefined>()
    .setName("rice")
    .setAlias([])
    .setDescription("Appreciates rice")
    .setStatus("hidden")
    .setChat({
        execute: async (message) => {
            const rice = riceList[rngInt(0, riceList.length - 1)];
            await message.channel.send(rice);
        },
    });

export default hello;