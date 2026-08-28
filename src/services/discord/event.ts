import { MyEmbedBuilder, toOrdinal } from "@library";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const eventSchema = z.object({
    str: z.string(),
    tag: z.enum(["incoming", "ongoing", "annual"])
});

export type I_Event = z.infer<typeof eventSchema>;

export const monthAliases = [
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

// function embedCreator(event: Event, tag: "annual"): MyEmbedBuilder;
// function embedCreator(event: ActiveEvent, tag: "ongoing" | "incoming"): MyEmbedBuilder;
// function embedCreator(event: Event | ActiveEvent, tag: "ongoing" | "incoming" | "annual"): MyEmbedBuilder;
// function embedCreator(event: Event | ActiveEvent, tag: "ongoing" | "incoming" | "annual"): MyEmbedBuilder{
//     const embed = new MyEmbedBuilder();

//     embed.setTitle(event.title);

//     if(event.link)
//         embed.setURL(event.link);
    
//     if(event.img_path)
//         embed.setThumbnail(event.img_path);

//     if(event.short_description)
//         embed.setDescription(event.short_description);

//     if(isActiveEvent(event) && (tag === "ongoing" || tag === "incoming")){
//         if(tag === "ongoing"){
//             const startDate = new Date(event.start_date);
//             const endDate = new Date(event.end_date!);
//             const currentDate = new Date();

//             const progression = Math.floor((currentDate.getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime()) * 100);
//             const repeatHashtag = "#".repeat(Math.floor(progression / 5));
//             const repeatMinus = "-".repeat(Math.ceil((100 - progression) / 5));

//             embed.setFields({
//                 name: "Progression",
//                 value: `[${repeatHashtag}${repeatMinus}] (${progression}%)`
//             });

//             embed.setFooter({
//                 text: `Event period: ${event.start_date.replaceAll("-", "/")} - ${event.end_date?.replaceAll("-", "/")}`
//             })
//         }
//         if(tag === "incoming"){
//             const remainingDays = Math.floor((new Date(event.start_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

//             embed.setFooter({
//                 text: `incoming update at ${event.start_date.replaceAll("-", "/")} (in ${remainingDays} days)`
//             });
//         }
//     }
//     else if(isEvent(event) && tag === "annual"){
//         embed.setAuthor({name: `${translateMonth(event.start_month)} ${event.start_day ? toOrdinal(event.start_day) : ""} - ${translateMonth(event.end_month)} ${event.end_day ? toOrdinal(event.end_day) : ""}`})
//     }
//     else throw new Error("Invalid event type");

//     return embed;
// }

export async function event(args: I_Event): Promise<MessageCreateOptions & InteractionReplyOptions>{
    return {content: "not implmented"};

    // TODO
    // let eventRes: {
    //     content: string,
    //     event: (ActiveEvent | Event)[]
    // } = {
    //     content: "",
    //     event: []
    // };

    // switch(args.tag){
    //     case "incoming":{
    //         const event = await ActiveEventService.getIncomingEvent();

    //         eventRes = {
    //             content: `found ${event.length} incoming events`,
    //             event
    //         };

    //         break;
    //     }
    //     case "ongoing":{
    //         const event = await ActiveEventService.getOngoingActiveEvent();

    //         eventRes = {
    //             content: `found ${event.length} ongoing events`,
    //             event
    //         };
    //         break;
    //     }
    //     default:{
    //         let monthOrTitle: number | string;

    //         // this month if no argument
    //         if(args.str === "")
    //             monthOrTitle = new Date().getMonth() + 1;

    //         // next month if upcoming
    //         else if(args.str === "upcoming")
    //             monthOrTitle = new Date().getMonth() + 2;

    //         // if name of the month or number of the month
    //         else{
    //             const month = monthAliases.find(m => m.aliases.includes(args.str.toLowerCase()));
        
    //             if(month)
    //                 monthOrTitle = month.month;
    //             else
    //                 monthOrTitle = isNaN(parseInt(args.str)) ? args.str : parseInt(args.str);
    //         }

    //         const res = await (typeof monthOrTitle === "number" ? EventService.getEventByMonth(monthOrTitle) : EventService.getEventByName(monthOrTitle));

    //         if(res === undefined || (Array.isArray(res) && res.length === 0)){
    //             let error: string;
        
    //             if(typeof monthOrTitle === "number")
    //                 error = `No event found in month ${translateMonth(monthOrTitle)}`;
    //             else
    //                 error = `No event found with title ${monthOrTitle}`;
        
    //             return {
    //                 embeds: [new MyEmbedBuilder().setTitle(error)]
    //             };
    //         }

    //         const resArray = Array.isArray(res) ? res : [res];

    //         eventRes = {
    //             content: `${resArray.length} event${resArray.length > 1 ? "s" : ""} found ${typeof monthOrTitle === "number" ? `in ${translateMonth(monthOrTitle)}` : `with name ${monthOrTitle}`}`,
    //             event: resArray,
    //         };
    //         break;
    //     }
    // }

    // const embeds: MyEmbedBuilder[] = [];

    // for(const event of eventRes.event){
    //     const embed = embedCreator(event, args.tag);

    //     embeds.push(embed);
    // }

    // return {
    //     embeds,
    //     content: eventRes.content,
    // };
}