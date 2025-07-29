import fs from "fs";
import {debug} from "debug";

const log = debug("Library:LocalMusicSearch");

export interface LocalSearchResultItem{
    index: number;
    title: string;
}

/**
 * Search local music by name
 * @param term the term to search
 * @returns the index of the music in the local music list
 */
export function searchLocalMusic(term: string): LocalSearchResultItem[]{
    log(`Searching local music for term: ${term}`);

    return [{
        index: 0,
        title: "Summer Bar (Day)"
    }];
}

export function getLocalStream(index: number): fs.ReadStream{
    log(`Searching local music for index: ${index}`);

    const stream = fs.createReadStream("C:/Users/Lenovo/Documents/codes/heroku/cbts2/localmusic/Summer Bar (Day).mp3");
    return stream;
}