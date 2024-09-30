"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryService = void 0;
const _library_1 = require("../library");
const _models_1 = require("../models");
class StoryService {
    static async getStory(id) {
        const find = await StoryService.serviceSupabase.get(id);
        if (!find)
            throw new Error("story not found!");
        // return first occurence
        return find;
    }
    static async getAllUpdate() {
        return await StoryService.serviceSupabase.getAll();
    }
    static async deleteUpdate(id) {
        const find = await StoryService.serviceSupabase.get(id);
        if (!find)
            throw new Error("story not found");
        await StoryService.serviceSupabase.delete(id);
    }
    static async addUpdate(story) {
        await StoryService.serviceSupabase.add(story);
    }
    static async editUpdate(id, update) {
        return await StoryService.serviceSupabase.update(id, update);
    }
    static getRandomStory() {
        const stories = StoryService.serviceSupabase.cache;
        console.log(stories);
        const randomIndex = (0, _library_1.rngInt)(0, stories.length);
        return stories[randomIndex];
    }
}
exports.StoryService = StoryService;
StoryService.dbName = "story";
StoryService.serviceSupabase = new _library_1.ServiceSupabase("id", StoryService.dbName, {
    typeGuard: _models_1.isStory
});
//# sourceMappingURL=story.js.map