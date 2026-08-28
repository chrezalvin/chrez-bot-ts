import z from "zod";
import { discordUserModel } from "../models/DiscordUser";

export const discordUserView = discordUserModel;

export type DiscordUserView = z.infer<typeof discordUserView>;