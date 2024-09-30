"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.events_get_all = exports.events_add_event = exports.events_get = void 0;
const debug = require("debug")("Server:events");
const events_1 = require("../../services/events");
const events_get = async (req, res) => {
    const events = await events_1.EventService.getActiveEvent();
    res.send(events);
};
exports.events_get = events_get;
const events_add_event = async (req, res) => {
    res.send({});
};
exports.events_add_event = events_add_event;
const events_get_all = async (req, res) => {
    const events = await events_1.EventService.allEvents();
    res.send(events);
};
exports.events_get_all = events_get_all;
//# sourceMappingURL=events.js.map