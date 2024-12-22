import { MyEmbedBuilder, CommandBuilder, toOrdinal, ErrorValidation} from "@library";
import { ActiveEvent, Event, isActiveEvent, isEvent } from "@models";
import { ActiveEventService, EventService } from "@services";
import { SlashCommandBuilder } from "discord.js";

const monthAliases = [
    {
        "month": 1,
        "monthname": "January",
        "aliases": ["january", "jan"],
    },
    {
        "month": 2,
        "monthname": "February",
        "aliases": ["february", "feb"],
    },
    {
        "month": 3,
        "monthname": "March",
        "aliases": ["march", "mar"],
    },
    {
        "month": 4,
        "monthname": "April",
        "aliases": ["april", "apr"],
    },
    {
        "month": 5,
        "monthname": "May",
        "aliases": ["may"],
    },
    {
        "month": 6,
        "monthname": "June",
        "aliases": ["june", "jun"],
    },
    {
        "month": 7,
        "monthname": "July",
        "aliases": ["july", "jul"],
    },
    {
        "month": 8,
        "monthname": "August",
        "aliases": ["august", "aug"],
    },
    {
        "month": 9,
        "monthname": "September",
        "aliases": ["september", "sept"],
    },
    {
        "month": 10,
        "monthname": "October",
        "aliases": ["october", "oct"],
    },
    {
        "month": 11,
        "monthname": "November",
        "aliases": ["november", "nov"],
    },
    {
        "month": 12,
        "monthname": "December",
        "aliases": ["december", "dec"],
    },
];



function translateMonth(month: number): string{
    const name = monthAliases.find(m => m.month === month)?.monthname;

    if(name === undefined)
        throw new Error("Month not found");

    return name;
}

function embedCreator(event: Event, tag: "annual"): MyEmbedBuilder;
function embedCreator(event: ActiveEvent, tag: "ongoing" | "incoming"): MyEmbedBuilder;
function embedCreator(event: Event | ActiveEvent, tag: "ongoing" | "incoming" | "annual"): MyEmbedBuilder;
function embedCreator(event: Event | ActiveEvent, tag: "ongoing" | "incoming" | "annual"): MyEmbedBuilder{
    const embed = new MyEmbedBuilder();

    embed.setTitle(event.title);

    if(event.link)
        embed.setURL(event.link);
    
    if(event.img_path)
        embed.setThumbnail(event.img_path);

    if(event.short_description)
        embed.setDescription(event.short_description);

    if(isActiveEvent(event) && (tag === "ongoing" || tag === "incoming")){
        if(tag === "ongoing"){
            const startDate = new Date(event.start_date);
            const endDate = new Date(event.end_date!);
            const currentDate = new Date();

            const progression = Math.floor((currentDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * 100);
            const repeatHashtag = "#".repeat(Math.floor(progression / 5));
            const repeatMinus = "-".repeat(Math.ceil((100 - progression) / 5));

            embed.setFields({
                name: "Progression",
                value: `[${repeatHashtag}${repeatMinus}] (${progression}%)`
            });

            embed.setFooter({
                text: `Event period: ${event.start_date.replaceAll("-", "/")} - ${event.end_date?.replaceAll("-", "/")}`
            })
        }
        if(tag === "incoming"){
            const remainingDays = Math.floor((new Date(event.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            embed.setFooter({
                text: `incoming update at ${event.start_date.replaceAll("-", "/")} (in ${remainingDays} days)`
            });
        }
    }
    else if(isEvent(event) && tag === "annual"){
        embed.setAuthor({name: `${translateMonth(event.start_month)} ${event.start_day ? toOrdinal(event.start_day) : ""} - ${translateMonth(event.end_month)} ${event.end_day ? toOrdinal(event.end_day) : ""}`})
    }
    else throw new Error("Invalid event type");

    return embed;
}

const run = async (args?: I_Event) => {
    if(args === undefined)
        return new ErrorValidation("no_argument_provided");

    let eventRes: {
        content: string,
        event: (ActiveEvent | Event)[]
    } = {
        content: "",
        event: []
    };

    switch(args.tag){
        case "incoming":{
            const event = await ActiveEventService.getIncomingEvent();

            eventRes = {
                content: `found ${event.length} incoming events`,
                event
            };

            break;
        }
        case "ongoing":{
            const event = await ActiveEventService.getOngoingActiveEvent();

            eventRes = {
                content: `found ${event.length} ongoing events`,
                event
            };
            break;
        }
        default:{
            let monthOrTitle: number | string;

            // this month if no argument
            if(args.str === "")
                monthOrTitle = new Date().getMonth() + 1;

            // next month if upcoming
            else if(args.str === "upcoming")
                monthOrTitle = new Date().getMonth() + 2;

            // if name of the month or number of the month
            else{
                const month = monthAliases.find(m => m.aliases.includes(args.str.toLowerCase()));
        
                if(month)
                    monthOrTitle = month.month;
                else
                    monthOrTitle = isNaN(parseInt(args.str)) ? args.str : parseInt(args.str);
            }

            const res = await (typeof monthOrTitle === "number" ? EventService.getEventByMonth(monthOrTitle) : EventService.getEventByName(monthOrTitle));

            if(res === undefined || (Array.isArray(res) && res.length === 0)){
                let error: string;
        
                if(typeof monthOrTitle === "number")
                    error = `No event found in month ${translateMonth(monthOrTitle)}`;
                else
                    error = `No event found with title ${monthOrTitle}`;
        
                return {
                    embeds: [new MyEmbedBuilder().setTitle(error)]
                };
            }

            const resArray = Array.isArray(res) ? res : [res];

            eventRes = {
                content: `${resArray.length} event${resArray.length > 1 ? "s" : ""} found ${typeof monthOrTitle === "number" ? `in ${translateMonth(monthOrTitle)}` : `with name ${monthOrTitle}`}`,
                event: resArray,
            };
            break;
        }
    }

    const embeds: MyEmbedBuilder[] = [];

    for(const event of eventRes.event){
        const embed = embedCreator(event, args.tag);

        embeds.push(embed);
    }

    return {
        embeds,
        content: eventRes.content,
    };
}

type EventTag = "incoming" | "ongoing" | "annual";

interface I_Event{
    str: string;
    tag: EventTag;
}

const chrezEvent = new CommandBuilder<I_Event>()
    .setName("event")
    .setAlias(["e", "ev", "events"])
    .setMode("available")
    .setDescription("Check what event is happening this month")
    .setExamples([
        {
            command: "Chrez event",
            description: "Give the list event this month"
        },
        {
            command: "Chrez event upcoming",
            description: "Give the list of upcoming event (next month)"
        },
        {
            command: "Chrez event january",
            description: "Give the list of events in january"
        },
        {
            command: "Chrez event 1",
            description: "Give the list of events in january"
        },
        {
            command: "Chrez event valentine",
            description: "Give valentine event description"
        },
        {
            command: "Chrez event ongoing",
            description: "Give the list of ongoing event"
        },
        {
            command: "Chrez event incoming",
            description: "Give the list of incoming event"
        }
    ])
    .setSlash({
        interact: async (interaction, args) => {
            const embeds = await run(args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;
            
            await interaction.reply(embeds);
        },
        getParameter: (interaction) => {
            const month = interaction.options.getString("month", false);
            const title = interaction.options.getString("title", false);
            let tag = (interaction.options.getString("tag", false) ?? "annual") as EventTag;

            return {
                str: month || title || "",
                tag,
            };
        },
        slashCommand: new SlashCommandBuilder()
            .setName("event")
            .setDescription("give list of event with the given month")
            .addStringOption(option => {
                option.setName("month")
                    .setDescription("month to search")
                    .setRequired(false);
                
                for(const month of monthAliases){
                    option.addChoices({
                        name: month.monthname,
                        value: month.monthname
                    })
                }
                return option;
            })
            .addStringOption(option => option
                .setName("tag")
                .setDescription("(optional) tag for ongoing event or incoming event")
                .setRequired(false)
                .setChoices([
                    {
                        name: "ongoing",
                        value: "Ongoing"
                    },
                    {
                        name: "incoming",
                        value: "Incoming"
                    }
                ])
            )
            .addStringOption(option => option
                .setName("title")
                .setDescription("title of the event")
                .setRequired(false)
            ),
    })
    .setChat({
        execute: async (message, args) => {
            const embeds = await run(args);

            if(ErrorValidation.isErrorValidation(embeds))
                return embeds;
        
            await message.channel.send(embeds);
        },
        getParameter: (_, args) => {
            const arg = args[0];
            let tag: EventTag;

            switch(arg){
                case "ongoing":
                case "incoming":
                    tag = arg;
                    break;
                default:
                    tag = "annual";
            }


            return {
                str: args[0] || "",
                tag
            };
        }
    })

export default chrezEvent;