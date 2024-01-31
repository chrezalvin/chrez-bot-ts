const debug = require('debug')('Server:events');

import {firebaseApp} from "@config";
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, arrayUnion } from 'firebase/firestore/lite';

interface Event{
    month: string;
    eventList: {
        name: string;
        description: string;
    }[];
}

function isEvent(obj: unknown): obj is Event{
    if(typeof obj !== "object" || obj === null) return false;

    if(!("month" in obj) || !("eventList" in obj)) return false;


    return obj.month !== undefined && obj.eventList !== undefined;
}

const db = getFirestore(firebaseApp);

export async function getEventByMonth(month?: string){
    const eventMonth = month ?? new Date().toLocaleString('default', { month: 'long' }).toLowerCase();
    const q = query(collection(db, 'events'), where('month', '==', eventMonth));

    debug(`Requesting events in ${eventMonth}`);

    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty){
        const event = querySnapshot.docs[0].data();

        if(isEvent(event))
            return event;
        else
            throw new Error("Event not found!");
    }
    else
        throw new Error("Event not found!");
}

export async function addEventByMonth(monthName: string, event: {name: string, description: string}){
    const q = query(collection(db, 'events'), where('month', '==', monthName));

    const querySnapshot = await getDocs(q);

    if(querySnapshot.empty)
        throw new Error("MonthName not found!");

    await updateDoc(querySnapshot.docs[0].ref, {
        eventList: arrayUnion(event)
    })
}