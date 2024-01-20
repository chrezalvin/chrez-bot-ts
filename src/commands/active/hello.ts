import { CommandBuilder } from "@modules/CommandBuilder";

const hello = new CommandBuilder<undefined>()
    .setName("hello")
    .setDescription("Says hello")
    .setStatus("public")
    .setSlash({
        interact: async (interaction) => {
            await interaction.reply(`Hello, ${interaction.member?.user.username}!`);
        },
    })
    .setChat({
        execute: async (message) => {
            await message.channel.send("hi");
        },
    });

export default hello;