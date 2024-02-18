import { firebaseApp } from "@config";
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    getFirestore, 
    query, 
    setDoc,
} from "firebase/firestore/lite";

export interface I_Update{
    version: string;
    news?: string[];
    bugfix?: string[];
}

const dbName = "update";
const db = getFirestore(firebaseApp);

export function isUpdate(obj: unknown): obj is I_Update{
    if(typeof obj !== "object" || obj === null) return false;

    // update can have either news or bugfix or both
    if("news" in obj && "bugfix" in obj) return true;
    else if("news" in obj && !("bugfix" in obj)) return true;
    else if(!("news" in obj) && "bugfix" in obj) return true;
    else
        return false;
}

export async function getAllUpdate(): Promise<I_Update[]>{
    const q = query(collection(db, dbName));
    const snapShot = await getDocs(q);

    const updates: I_Update[] = snapShot.docs
                .filter(doc => isUpdate(doc.data()))
                .map(doc => {
                    return {
                        version: doc.id,
                        news: doc.data().news,
                        bugfix: doc.data().bugfix
                    };
                });

    return updates;
}

export async function getUpdate(version: string): Promise<I_Update>{
    const docRef = doc(db, dbName, version);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists() && isUpdate(docSnap.data()))
        return {
            version,
            news: docSnap.data().news,
            bugfix: docSnap.data().bugfix
        };

    throw new Error("version not found");
}

export async function addNewUpdate(update: I_Update): Promise<boolean>{
    const docRef = doc(db, dbName, update.version);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists())
        return false;

    await setDoc(docRef, {
        ...update
    });

    return true;
}