import { EmbedData } from "discord.js";
import traitData from "./trait";
import levellingData from "./levelling";
import refiningData from "./refining";
import mazeData from "./maze";
import freeReset from "./freeResetGuide";

export const guideDataLookup: {name: string, data: EmbedData[]}[] = [
    {
        name: "trait",
        data: traitData
    },
    {
        name: "levelling",
        data: levellingData
    },
    {
        name: "refining",
        data: refiningData
    },
    {
        name: "maze",
        data: mazeData
    },
    {
        name: "freeReset",
        data: freeReset
    }
]

export default guideDataLookup;