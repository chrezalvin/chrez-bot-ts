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
    length: unknown;
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