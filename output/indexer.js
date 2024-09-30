"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
// client.on('ready', async () => {
//     const id = '1090209996039540776';
//     const ch = await client.channels.fetch("823744668670885899");
//     (ch as TextChannel).send()
// })
client.on('error', (error) => {
    console.log("an error occured");
});
client.on("messageCreate", async (message) => {
    if (message.content === "here") {
        message.channel.send({ embeds: [new EmbedBuilder()
                    .setTitle("level 1 - 20")
                    .setThumbnail("https://static.wikia.nocookie.net/toram/images/8/88/Colon.png/revision/latest?cb=20150918061311")
                    .setFields({ name: "Colon", value: "Rugio Ruins" })
                    .setColor("Yellow")
            ] });
    }
    if (message.content !== "bulkdelete")
        return;
    try {
        const msg = await message.channel.bulkDelete(100, true);
        message.channel.send(`successfully deleted ${msg.size} messages`);
    }
    catch (e) {
        console.log("failed to delete message");
        if (e.message)
            console.log(`Message: ${e.message}`);
    }
});
client.on('ready', () => { console.log(`bot ready! ${registlet.length}`); });
client.on('ready', async () => {
});
client.on('ready', async () => {
    const flag = true;
    // const guildID = "739696962097512449"; // cphoenix
    const guildID = "1106456574752464936"; // HCI Kelompok 7
    // const guildID = "822912738875146261"; // cb test
    // const channelID = "739696962097512452"; // cphoenix
    // const channelID = "823744668670885899"; // cb test
    const channelID = "1107912853425508376"; // HCI Kelompok 7
    const index = [];
    const ch = await client.channels.fetch(channelID);
    if (ch === undefined)
        throw new Error("channel is undefined!");
    const myEmbed = new EmbedBuilder();
    myEmbed
        .setTitle("TODO")
        .setColor("Yellow")
        .setDescription(tugas.todo.join("\n"));
    // for(const ele of tugas.todo)
    //     myEmbed.addFields({name: ele.title, value: `${ele.text}\n${ele.contoh}`});
    if (flag)
        return;
    ch.send({ embeds: [myEmbed] });
    const targs = [levellings[0], levellings[1], levellings[2], levellings[3], levellings[4]];
    for (const targ of levellings) {
        const embed = createEmbedForLevelling(targ);
        const { id } = await ch.send({ embeds: [
                embed
            ] });
        index.push({ name: `Level ${targ.level}`, value: id });
    }
    for (const embed of levellingExplanation()) {
        const { id } = await ch.send({ embeds: [
                embed
            ] });
        if (embed.data.title)
            index.push({ name: embed.data.title, value: id });
    }
    // index.push({name: "How does leveling work?", value: id});
    let section = [];
    section.push(index.slice(0, 25).map((val, idx) => `**${idx + 1}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'));
    // section.push(index.slice(26, 50).map((val, idx) => `**${idx + 26}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))
    // section.push(index.slice(51, 75).map((val, idx) => `**${idx + 51}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))
    // section.push(index.slice(76, 100).map((val, idx) => `**${idx + 76}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))
    // section.push(index.slice(101, index.length).map((val, idx) => `**${idx + 101}.** [${val.name}](https://discord.com/channels/${guildID}/${channelID}/${val.value})`).join('\n'))
    for (const sect of section) {
        const embed = new EmbedBuilder()
            .setColor('White')
            .setTitle("Toram Levelling Index List")
            .setThumbnail("https://cdn.discordapp.com/attachments/739696962097512452/1090279895847940238/image0.jpg")
            .setDescription(`Please select the **blue text** below to guide you to the selected levelling range\n ${sect}`)
            .setFooter({ text: "you can use pinned message to quickly go back here\nSpecial thanks to Sulain for making this guide", iconURL: "https://media.discordapp.net/attachments/970318433994571836/971364635196411944/pushpin.png" });
        ch.send({ embeds: [embed] });
    }
});
function createEmbedForRegistlet(registlet) {
    const embed = new EmbedBuilder()
        .setTitle(registlet.name)
        .addFields({ name: "Max Level", value: `${registlet.maxLevel}` }, { name: "Description", value: registlet.description })
        .setColor('Yellow')
        .setFooter({ text: `available at stoodie level ${registlet.stoodie.join(", ")}` });
    if (registlet.imgThumbnail)
        embed.setThumbnail(registlet.imgThumbnail);
    return embed;
}
function createEmbedForCombotag(combotag) {
    const embed = new EmbedBuilder()
        .setTitle(combotag.name)
        .setFields({ name: "Description", value: combotag.description.map(example => example.replace(/^\*/, "\* ")).join('\n') })
        .setColor("Yellow");
    if (combotag.thumbnail)
        embed.setThumbnail(combotag.thumbnail);
    if (combotag.examples)
        embed.addFields({ name: "Examples", value: combotag.examples.join('\n\n') });
    if (combotag.footer)
        embed.setFooter({ text: combotag.footer, iconURL: "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Information_icon.svg/2048px-Information_icon.svg.png" });
    return embed;
}
function createEmbedForLevelling(leveling) {
    const embed = new EmbedBuilder().setTitle(`Level ${leveling.level}`).setColor("Yellow");
    if (leveling.description)
        embed.setDescription(leveling.description);
    if (leveling.footer)
        embed.setFooter({ text: leveling.footer, iconURL: "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Information_icon.svg/2048px-Information_icon.svg.png" });
    for (const mob of leveling.mobs)
        embed.addFields({ name: `${mob.name}${mob.difficulty ? ` [${mob.difficulty}]` : ""} (lv ${mob.level})`, value: `${mob.location}${mob.corynID ? `\n[coryn](https://coryn.club/monster.php?id=${mob.corynID})` : ""}`, inline: true });
    return embed;
}
function levellingExplanation() {
    const embed = new EmbedBuilder().setColor("Green").setTitle("How Does Levelling Work?");
    embed.addFields({ name: "Base EXP", value: "Base exp is the basis of the EXP you get from boss, you can check this on boss info (or boss info on map in miniboss case)" });
    embed.addFields({ name: "Level Range", value: "The closer your level from boss, the more EXP you will obtain:\n±0-5: x11\n±6: x10\n±7: x9\n±8: x7\n±9: x3\n±10: x0.99\n**\*** this amount multiplies the base exp first then got multiplied more by EXP%" });
    embed.addFields({ name: "EXP Formula", value: "With everything covered, the EXP Formula is:\n\`EXP = ([Base EXP] x [Level Range Multiplier]) * (1 + [Total EXP%]/100)\`" });
    embed.addFields({ name: "Level Formula", value: "The EXP needed to **Level Up** is:\n\`EXP = 0.025[lvl]^4 + 2 x [lvl]\`\n\* this formula is **exponential** meaning that the difference gap between one level to another will be very big on late game" });
    const achievements = [
        { name: "Tune Up", description: "Defeated 30 monsters 30 levels higher/lower than you", Exp: "10%" },
        { name: "Warm Up", description: "Defeated 30 monsters 20 levels higher/lower than you", Exp: "10%" },
        { name: "Best Condition", description: "Defeated 30 monsters 10 levels higher/lower than you", Exp: "10%" },
        { name: "Haven't Played Enough!", description: "Played more than 30 minutes in total today", Exp: "10%" },
        { name: "Haven't Played Enough At All!!", description: "Played more than 60 minutes in total today", Exp: "10%" },
    ];
    const embed2 = new EmbedBuilder().setColor("Green").setTitle("Tips to Earn More EXP");
    embed2.addFields({ name: "Get in the level range", value: "The closer you are from the boss/mob level range, the more exp you will get.\nI suggest to level in atleast ±8 level from mob/boss" });
    embed2.addFields({ name: "Daily Boost", value: `There are 5 different achievement that will increase your EXP%, that is:\n ${achievements.map(a => `\* \`${a.name}\` (+${a.Exp}): ${a.description}`).join('\n')}\n\* You'll get +${achievements.length * 10}% EXP in total from doing all this achievement\n**\*** A common way to do this is to farm low level mob with low level char using Area skill such as Magic:Storm or Earthbind (knuck)` });
    embed2.addFields({ name: "Player Level Achievement", value: "Each 30 level, you will earn an achievement \`(An Adventurer's Diary Vol.x)\` that increases your +EXP% char below your level. So if you have a high level char already, it'll be easier to level lower level char" });
    embed2.addFields({ name: "EXP Gain Up Skill", value: "Survival skill [EXP Gain up] give you +10% EXP at Level 10. This is kind of a waste of Skill Point so i suggest getting the stargem instead" });
    embed2.addFields({ name: "Wayfarer Registlet", value: "Wayfarer Registlet gives 10% exp (with the cost of -5% dmg) [click for more info](https://discord.com/channels/739696962097512449/1090282354838352012/1090298522563260660)" });
    embed2.addFields({ name: "Guild Food", value: "A benefit from guild raid is that the guild can raise all of their member EXP% gain (upto +100%!) by upgrading their guild food exp" });
    embed2.addFields({ name: "EXP Book", value: "A common way to increases your exp significantly is by using EXP book. This method, of course very expensive so don't use it on low level char (<150)" });
    return [embed, embed2];
}
// const client = new ChrezBot({
//     intents: [
//         GatewayIntentBits.Guilds, 
//         GatewayIntentBits.GuildMessages, 
//         GatewayIntentBits.MessageContent,
//     ] 
// });
// ( async function() {
//     const commandDir = fs.readdirSync(path.resolve(__dirname, "./commands"));
//     const eventDir = fs.readdirSync(path.resolve(__dirname, "./events"))
//     for(const file of commandDir){
//         const a = await importModule<CommandReturnTypes>(`./commands/${file}`);
//         // commands.push(a);
//         client._commands.set(a.name, a);
//     }
//     for(const file of eventDir){
//         const a = await importModule<EventReturnType<keyof ClientEvents>>(`./events/${file}`);
//         client._events.set(a.name, a);
//     }
//     debug(`commands available: ${client._commands.map(command => command.name)}`);
//     try{
//         for(const [name, event] of client._events){
//             debug(`register command ${name} on event ${event.eventType}`);
//             switch(event.eventType){
//                 case 'emit': client.emit(name, event.execute); break;
//                 //                                     bruh vvv
//                 case 'on': client.on(name, event.execute as any); break;
//                 case 'off': client.off(name, event.execute as any); break;
//                 case 'once': client.once(name, event.execute as any); break;
//                 default: throw new Error("Error!");
//             }
//         }
//     }
//     catch(error){
//         debug(`catch error ${error}`);
//     }
// })();
// client.once("ready", () => {
//     console.log(`bot ready! running on discord ${Discord.version}`)
// })
// // enable chat view option
// client.on("messageCreate", (msg) => {
// })
// client.on("messageCreate", (msg) => {
//     debug(`${msg.author.username}${msg.author.bot ? "(bot)": ""}: ${msg.content}`)
//     try{
//         let get = client._commands.find(p => p.name === msg.content)
//         if(get === undefined) return;
//         debug(`received message command "${get.name}"`);
//         get.execute(msg);
//     }
//     catch(error: any){
//         if(typeof error.message === 'string'){
//             debug(`Error catched: ${error.message}`);
//         }
//         else if(typeof error === "string"){
//             debug(`Error catched: ${error}`);
//         }
//         else if(typeof error === "object"){
//             debug("Error caught no message found, full obj error:");
//             debug(error);
//         }
//         else{
//             debug("unknown error found");
//         }
//     }
// })
// client.on("interactionCreate", (interaction) => {
//     // console.log(interaction.isCommand);
//     if(interaction.isCommand()){
//         debug(`received interaction command "/${interaction.commandName}"`);
//         console.log(interaction.commandName);
//         interaction.reply("hi");
//     }
// })
client.login(process.env.DISCORD_TOKEN);
