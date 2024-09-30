"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const debug = require('debug')('Server:events');
const _library_1 = require("../library");
const _models_1 = require("../models");
class EventService {
    static async translateImageToUrl(eventOrPath) {
        if (typeof eventOrPath === "string")
            return await EventService.fileManager.getUrlFromPath(eventOrPath);
        else if (typeof eventOrPath === "object")
            return { ...eventOrPath, img_path: eventOrPath.img_path && await EventService.fileManager.getUrlFromPath(eventOrPath.img_path) };
        else
            throw Error("Never");
    }
    static async getEventList() {
        return await Promise.all(EventService
            .eventManager
            .cache
            .map(EventService.translateImageToUrl));
    }
    static async allEvents() {
        const res = await EventService.eventManager.getAll();
        return await Promise.all(res.map(EventService.translateImageToUrl));
    }
    static async getEventByMonth(month) {
        // if month is not provided, get the current month
        const currentMonth = new Date().getMonth() + 1;
        const res = await EventService
            .eventManager
            .client
            .select("*")
            .or(`start_month.eq.${month || currentMonth},end_month.eq.${month || currentMonth}`);
        if (res.error)
            throw new Error(res.error.message);
        const events = res.data.filter(_models_1.isEvent);
        return await Promise.all(events.map(EventService.translateImageToUrl));
    }
    static getEventByName(name) {
        return EventService.eventManager.cache.find(e => e.title.match(new RegExp(name, "i")));
    }
    static getEvent(id) {
        return EventService.eventManager.get(id);
    }
    static async getActiveEvent() {
        const date = new Date().toISOString();
        const res = await EventService
            .eventManager
            .client
            .select("*")
            .lte("start_date", date)
            .gte("end_date", date);
        if (res.error)
            throw new Error(res.error.message);
        return res.data.filter(_models_1.isEvent);
    }
}
exports.EventService = EventService;
EventService.eventPath = "events";
EventService.eventManager = new _library_1.ServiceSupabase("id", EventService.eventPath, {
    typeGuard: _models_1.isEvent
});
EventService.fileManager = new _library_1.FileManagerFirebase("");
exports.default = EventService;
//# sourceMappingURL=events.js.map