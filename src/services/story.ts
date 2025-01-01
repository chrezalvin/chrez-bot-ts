import {rngInt, ServiceFileSupabase} from "@library";
import { StrictOmit } from "@library/CustomTypes";
import { Story, isStory } from "@models";

export class StoryService{
    protected static readonly dbName = "story";

    public static serviceSupabase = new ServiceFileSupabase<Story, "story_id">(
                "story_id",  
                {
                    tableName: StoryService.dbName,
                    typeGuard: isStory,
                    useCache: true
                }
            );

    public static async getStory(id: Story["story_id"]): Promise<Story>{
        return await StoryService.serviceSupabase.get(id);
    }

    public static async getAllStories(): Promise<Story[]>{
        return await StoryService.serviceSupabase.getAll();
    }

    public static async deleteStory(id: Story["story_id"]): Promise<void>{
        await StoryService.serviceSupabase.delete(id);
    }

    public static async addStory(story: StrictOmit<Story, "story_id">): Promise<Story | undefined>{
        return await StoryService.serviceSupabase.add(story);
    }

    public static async editStory(id: number, update: StrictOmit<Story, "story_id">): Promise<Story | undefined>{
        return await StoryService.serviceSupabase.update(id, update);
    }

    public static async updateStory(id: Story["story_id"], story: Partial<StrictOmit<Story, "story_id">>): Promise<Story | undefined>{
        return await StoryService.serviceSupabase.update(id, story);
    }

    public static getRandomStory(): Story{
        const stories = StoryService.serviceSupabase.cache;
        const randomIndex = rngInt(0, stories.length - 1);

        return stories[randomIndex];
    }
}