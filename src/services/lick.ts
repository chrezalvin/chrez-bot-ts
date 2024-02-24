import {firebaseApp} from "@config";
import { rngInt } from "@library";
import { getStorage, ref, getDownloadURL, listAll, ListResult, StorageReference, list} from "firebase/storage";

const storage = getStorage(firebaseApp);

const cursedPath = "images/licks";

export const licks: StorageReference[] = [];

async function getLickList(): Promise<ListResult> {
    const list = await listAll(ref(storage, cursedPath));
    return list;
}

export async function getLickUrl(index: number = 0): Promise<string>{
    const url = await getDownloadURL(licks[index]);

    return url;
}

export async function getRandomLickUrl(): Promise<string>{
    const index = rngInt(0, licks.length);
    const ref = licks[index];
    const url = await getDownloadURL(ref);

    return url;
}

(async () => {
    const list = await getLickList();

    licks.push(...list.items);
})();