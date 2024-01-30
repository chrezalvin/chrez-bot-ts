import on from "./on";
import once from "./once";
import { Awaitable, ClientEvents } from "discord.js";

export type AllClientEvents = "on" | "once" | "off";
export type EventArguments<K extends keyof ClientEvents> = [event: K, listener: (...args: ClientEvents[K]) => Awaitable<void>];

export interface EventReturnType{
    name: AllClientEvents;
    execute: EventArguments<keyof ClientEvents>[]
}

export const botEvents: EventReturnType[] = [
    on, once
]

export default botEvents;