import { ErrorValidation, MyEmbedBuilder } from "@library";
import { StoryViewService } from "@services/supabase/services";
import { storyModel } from "@services/supabase/types/models/Story";
import { InteractionReplyOptions, MessageCreateOptions } from "discord.js";
import z from "zod";

export const storySchema = z.object({
    index: z.nullish(storyModel.shape.story_id)
});

export type I_Story = z.input<typeof storySchema>;

export async function story(args: I_Story): Promise<MessageCreateOptions & InteractionReplyOptions>{
    const parsed = storySchema.parse(args);

    const story = await StoryViewService.getStory(parsed.index ?? undefined);

    if(!story)
        throw new ErrorValidation("something_not_found", "story");

    // const story = stories[index];
    const embeds: MyEmbedBuilder[] = [];
    const sentences: string[] = [];
    let flagTitle: boolean = false;
    for(let iii = 0, count = 0; iii < story.description.length; ++iii){
        sentences.push(story.description[iii]);
        count += story.description[iii].length

        if(count > 2000){
            embeds.push(
                new MyEmbedBuilder()
                .setDescription(sentences.splice(0, sentences.length).join('\n\n'))
                .setTitle(!flagTitle ? `${story.title} by ${story.author}` : null)
            )

            count = 0;
            flagTitle = true;
        }
    }

    embeds.push(
        new MyEmbedBuilder()
        .setDescription(sentences.join("\n\n"))
        .setTitle(!flagTitle ? `${story.title} by ${story.author}` : null)
        .setFooter(story.footer ?{text: story.footer}: null)
    )

    return {embeds};
}