const debug = require('debug')('Server:recommend');

import recommendeds from "@shared/recommendeds";
import {firebaseApp} from "@config";
import { getFirestore, collection, getDocs, query, limit, startAt, addDoc, deleteDoc, updateDoc, doc, getDoc, Firestore, count } from 'firebase/firestore/lite';

export interface Recommend{
    title: string;
    description: string;
    imgUrl?: string;
    link?: string;
    category?: string[];
}

export interface RecommendDoc{
    id: string;
    data: Recommend;
}

const dbName = "recommend";
const db = getFirestore(firebaseApp);

export async function getAllRecommend(){
    const q = query(collection(db, dbName));

    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty){
        const recommends: RecommendDoc[] = querySnapshot
                    .docs
                    .filter(doc => isRecommend(doc.data()))
                    .map(doc => {
                        return {data: doc.data() as Recommend, id: doc.id}
                    });

        return recommends;
    }
    else
        throw new Error("Recommend not found!");
}

export function isRecommend(obj: unknown): obj is Recommend{
    if(typeof obj !== "object" || obj === null) return false;

    if(!("title" in obj) || !("description" in obj)) return false;

    return obj.title !== undefined && obj.description !== undefined;
}

export async function getRecommend(page: number = 0): Promise<RecommendDoc[]>{
    const q = query(collection(db, dbName), startAt(page * 5), limit(5));

    debug(`Requesting recommend in page ${page}`);

    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty){
        const recommends: RecommendDoc[] = querySnapshot
                    .docs
                    .filter(doc => isRecommend(doc.data()))
                    .map(doc => {
                        return {data: doc.data() as Recommend, id: doc.id}
                    });

        return recommends;
    }
    else
        throw new Error("Recommend not found!");
}

export async function getRecommendById(id: string): Promise<RecommendDoc>{
    const ref = doc(db, dbName, id);
    const docSnapshot = await getDoc(ref);

    if(!docSnapshot.exists())
        throw new Error("Recommend not found!");
    
    const data = docSnapshot.data();
    if(isRecommend(data))
        return {data: data as Recommend, id: id};
    else
        throw new Error("Recommend not found!");
}

export async function addRecommend(recommend: Recommend){
    // check if recommend is valid
    if(recommend.link !== undefined){
        const url = new URL(recommend.link);
        if(url.protocol !== "http:" && url.protocol !== "https:")
            throw new Error("Invalid link!");
    }
    
    const res = await addDoc(collection(db, dbName), recommend);

    return res.id;
}

export async function deleteRecommendById(id: string){
    const q = query(collection(db, dbName), limit(1), startAt(id));
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty){
        const doc = querySnapshot.docs[0];
        await deleteDoc(doc.ref);
    }
    else
        throw new Error("Recommend not found!");
}

export async function updateCommandById(id: string, recommend: Recommend){
    const resDoc = await getDoc(doc(db, dbName, id));

    if(!resDoc.exists())
        throw new Error("Recommend not found!");

    updateDoc(resDoc.ref, {...recommend});
}