import {firebaseApp} from "@config";
import { rngInt } from "@library/basicFunctions";
import { getStorage, ref, getDownloadURL, listAll, ListResult, StorageReference, list} from "firebase/storage";

const storage = getStorage(firebaseApp);

const cursedPath = "images/cursed";

export const cursedList: StorageReference[] = [];

async function getCursedList(): Promise<ListResult> {
    const list = await listAll(ref(storage, cursedPath));
    return list;
}

export async function getCursedUrl(index: number = 0): Promise<string>{
    const url = await getDownloadURL(cursedList[index]);

    return url;
}

export async function getRandomCursedUrl(): Promise<string>{
    const index = rngInt(0, cursedList.length);
    const ref = cursedList[index];
    const url = await getDownloadURL(ref);

    return url;
}

(async () => {
    const list = await getCursedList();

    cursedList.push(...list.items);
})();