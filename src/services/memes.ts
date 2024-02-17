import {firebaseApp} from "@config";
import { ErrorValidation } from "@library/ErrorValidation";
import { rngInt } from "@library/basicFunctions";
import { getStorage, ref, getDownloadURL, listAll, ListResult, StorageReference, list} from "firebase/storage";

const storage = getStorage(firebaseApp);

const memePathSfw = "images/memes/sfw";
const memePathNsfw = "images/memes/nsfw";

export const memeListSfw: StorageReference[] = [];
export const memeListNsfw: StorageReference[] = [];


async function getMemeList(nsfw: boolean = false): Promise<ListResult> {
    const list = await listAll(ref(storage, nsfw ? memePathNsfw : memePathSfw));
    return list;
}

export async function getMemeUrl(index: number = 0, nsfw: boolean = false): Promise<string>{
    const url = await getDownloadURL(nsfw ? memeListNsfw[index] : memeListSfw[index]);

    return url;
}

export async function getRandomMemeUrl(nsfw: boolean = false): Promise<string>{
    const index = rngInt(0, nsfw ? memeListNsfw.length : memeListSfw.length);
    const ref = nsfw ? memeListNsfw[index] : memeListSfw[index];
    const url = await getDownloadURL(ref);

    return url;
}

(async () => {
    const listSfw = await getMemeList(false);
    const listNsfw = await getMemeList(true);

    memeListSfw.push(...listSfw.items);
    memeListNsfw.push(...listNsfw.items);
})();