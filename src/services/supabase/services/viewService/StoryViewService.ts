import { rngInt } from "@library";
import { MappedArray } from "@library/MappedArray";
import { storyView, StoryView } from "@services/supabase/types/views/StoryView";
import { supabasePublic } from "@shared/supabase";

let cache = new MappedArray<StoryView["story_id"], StoryView>();

export async function getStory(story_id?: StoryView["story_id"]): Promise<StoryView | undefined>{
    if(story_id){
        if(cache.has(story_id))
            return cache.get(story_id)
    }
    else
        if(cache.size !== 0)
            return cache.random().value;

    const allStory = await getAllStory()    
    const index = story_id ?? rngInt(0, cache.size - 1);

    return allStory[index];
}

export async function getStoryById(story_id: StoryView["story_id"]): Promise<StoryView>{
    if(cache.has(story_id))
        return cache.get(story_id)!;

    const {data} = await supabasePublic
        .from("vw_stories")
        .select()
        .eq("story_id", story_id)
        .single()
        .throwOnError();

    const parsed = storyView.parse(data);

    cache.set(parsed.story_id, parsed);

    return parsed;
}

async function getAllStory(): Promise<StoryView[]>{
    const {data} = await supabasePublic
        .from("vw_stories")
        .select()
        .throwOnError();

    const parsed = storyView.array().parse(data);

    cache.set(parsed.map(story => ({key: story.story_id, value: story})));

    return parsed;
}