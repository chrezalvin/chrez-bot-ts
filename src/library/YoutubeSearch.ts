import internal from "stream";
import { spawn } from "child_process";

const youtubeSearch = require("youtube-search-api");

export interface YoutubeSearchResultItem{
    id: string;
    type: string;
    thumbnail: {
        thumbnails: {
           url: string;
           width: number;
           height: number
        }[]
    };
    title: string;
    channelTitle: string;
    shortBylineText: unknown;
    length: {
        accessibility: {
           accessibilityData: {
              label: string
           }
        };
        simpleText: string
    };
    isLive: boolean;
}

export interface YoutubeSearchResult {
    items: YoutubeSearchResultItem[];
    nextPage: unknown;
}

/**
 * search videos on youtube
 * @param searchTerm youtube's search term
 * @param limit limit of result
 * @returns 
 */
export async function searchYoutube(searchTerm: string, limit: number = 1): Promise<YoutubeSearchResult> {
    const response = await youtubeSearch.GetListByKeyword(searchTerm, false, limit);

    return response;
}

export function createYtdlStream(videoUrl: string): internal.Readable {
    return spawn("yt-dlp", ["-f", "bestaudio", "--rm-cache-dir", "-o", "-", videoUrl]).stdout;
}