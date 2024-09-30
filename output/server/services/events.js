"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEventByMonth = exports.getEventByMonth = void 0;
const debug = require('debug')('ChrezBot:server:events');
const _config_1 = require("../../config");
const lite_1 = require("firebase/firestore/lite");
function isEvent(obj) {
    if (typeof obj !== "object" || obj === null)
        return false;
    if (!("month" in obj) || !("eventList" in obj))
        return false;
    return obj.month !== undefined && obj.eventList !== undefined;
}
const db = (0, lite_1.getFirestore)(_config_1.firebaseApp);
async function getEventByMonth(month) {
    const eventMonth = month ?? new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
    const q = (0, lite_1.query)((0, lite_1.collection)(db, 'events'), (0, lite_1.where)('month', '==', eventMonth));
    debug(`Requesting events in ${eventMonth}`);
    const querySnapshot = await (0, lite_1.getDocs)(q);
    if (!querySnapshot.empty) {
        const event = querySnapshot.docs[0].data();
        if (isEvent(event))
            return event;
        else
            throw new Error("Event not found!");
    }
    else
        throw new Error("Event not found!");
}
exports.getEventByMonth = getEventByMonth;
async function addEventByMonth(monthName, event) {
    const q = (0, lite_1.query)((0, lite_1.collection)(db, 'events'), (0, lite_1.where)('month', '==', monthName));
    const querySnapshot = await (0, lite_1.getDocs)(q);
    if (querySnapshot.empty)
        throw new Error("MonthName not found!");
    await (0, lite_1.updateDoc)(querySnapshot.docs[0].ref, {
        eventList: (0, lite_1.arrayUnion)(event)
    });
}
exports.addEventByMonth = addEventByMonth;
