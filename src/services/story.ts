import {rngInt, ServiceFileSupabase} from "@library";
import { Story, isStory } from "@models";

export class StoryService{
    protected static readonly dbName = "story";

    public static serviceSupabase = new ServiceFileSupabase<Story, "id">(
                "id",  
                {
                    tableName: StoryService.dbName,
                    typeGuard: isStory,
                    useCache: true
                }
            );

    public static async getStory(id: number): Promise<Story>{
        return await StoryService.serviceSupabase.get(id);
    }

    public static async getAllStories(): Promise<Story[]>{
        return await StoryService.serviceSupabase.getAll();
    }

    public static async deleteStory(id: number): Promise<void>{
        await StoryService.serviceSupabase.delete(id);
    }

    public static async addStory(story: Omit<Story, "id">): Promise<Story | undefined>{
        return await StoryService.serviceSupabase.add(story);
    }

    public static async editStory(id: number, update: Omit<Story, "id">): Promise<Story | undefined>{
        return await StoryService.serviceSupabase.update(id, update);
    }

    public static async updateStory(id: Story["id"], story: Partial<Omit<Story, "id">>): Promise<Story | undefined>{
        return await StoryService.serviceSupabase.update(id, story);
    }

    public static getRandomStory(): Story{
        const stories = StoryService.serviceSupabase.cache;
        const randomIndex = rngInt(0, stories.length - 1);

        return stories[randomIndex];
    }
}