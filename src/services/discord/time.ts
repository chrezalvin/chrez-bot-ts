const debug = require("debug")("ChrezBot:time");

import { MyEmbedBuilder } from "@library";
import { InteractionReplyOptions, MessageCreateOptions, VoiceBasedChannel } from "discord.js";
import z from "zod";
import { TimezoneViewService } from "@services/supabase/services";

export const timeSchema = z.object({
  keyword: z.string().default("Japan")
});

export type I_Time = z.input<typeof timeSchema>;

export async function time(args: I_Time): Promise<MessageCreateOptions & InteractionReplyOptions>{
  const parsed = timeSchema.parse(args);
  
  const time = new Date();
  const embed = new MyEmbedBuilder();

  const {timezone, country} = await TimezoneViewService.getTimezone(parsed.keyword);
  
  debug(`getting ${timezone} time`);
  const localtime = time.toLocaleString('en-US', {timeZone: timezone, hour12: false, dateStyle: "full", timeStyle: "medium"}).split(' ');

  embed.setTitle(`${country?.name ?? timezone} time`)
    .setDescription(`**${localtime.join(" ")}**`)

  if(country?.flag)
    embed.setThumbnail(country.flag);

  return {embeds: [embed]};
}