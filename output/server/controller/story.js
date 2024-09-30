"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.story_get_random = exports.story_get_default = void 0;
const _services_1 = require("../../services");
const story_get_default = async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id))
        throw new Error("Invalid id!");
    const recommend = await _services_1.StoryService.getStory(id);
    res.json(recommend);
};
exports.story_get_default = story_get_default;
const story_get_random = async (req, res) => {
    const recommend = _services_1.StoryService.getRandomStory();
    res.json(recommend);
};
exports.story_get_random = story_get_random;
//# sourceMappingURL=story.js.map