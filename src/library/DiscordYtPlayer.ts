const debug = require("debug")("library:discord-yt-player");

import { spawn } from "child_process";
import internal from "stream";
import { VoiceBasedChannel } from "discord.js";
import { searchYoutube } from "./YoutubeSearch";
import { AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, joinVoiceChannel, PlayerSubscription } from "@discordjs/voice";

function createYtdlStream(videoUrl: string): internal.Readable {
    return spawn("yt-dlp", ["-f", "bestaudio", "--rm-cache-dir", "-o", "-", videoUrl]).stdout;
}

export interface DiscordYtPlayerItem{
    title: string;
    videoUrl: string;
    author: string;
    duration: string;
    thumbnailUrl?: string;
    requester?: {
        iconUrl: string;
        name: string;
    };
}

export default class DiscordYtPlayer{
    // queue of the stream, queue[0] is the current stream
    private m_queue: DiscordYtPlayerItem[] = [];

    private m_subscription: PlayerSubscription | null = null;
    private m_currentAudioResource: AudioResource | null = null;
    private m_currentStream: internal.Readable | null = null;

    private m_repeat: boolean = false;
    private m_timeoutDurationMs = 5 * 60 * 1000;
    private m_timeout: NodeJS.Timeout | null = null;
    private m_volume = 40 / 100;

    /**
     * creates a new discord yt player
     * @param option 
     */
    constructor(option?: {
        volume?: number;
        timeoutDurationMs?: number;
    }){
        if(option?.volume)
            this.m_volume = option.volume;

        if(option?.timeoutDurationMs)
            this.m_timeoutDurationMs = option.timeoutDurationMs;
    }

    // getter
    public get queue(){ return this.m_queue; }
    public get current(){ 
        if(this.m_queue.length === 0)
            return null;

        return this.m_queue[0];
    }

    public get volume(){
        return this.m_currentAudioResource?.volume?.volume ?? 1;
    }

    public get durationMs(){
        return this.m_currentAudioResource?.playbackDuration;
    }

    public get repeat(){
        return this.m_repeat;
    }

    // setter
    public set volume(volume: number){
        this.m_currentAudioResource?.volume?.setVolume(volume);
    }

    public set repeat(repeat: boolean){
        this.m_repeat = repeat;
    }

    /**
     * Play a youtube audio stream, if there is a stream currently playing, it will be queued
     * @param url youtube video url
     * @returns 
     */
    public async play(
            term: string, 
            channel: VoiceBasedChannel,
            options?: {
                requester?: DiscordYtPlayerItem["requester"];
                onSongEnd?: () => void;
                onQueueEnd?: () => void;
                onError?: (error: Error) => void;
            }
        ){
        const result = await searchYoutube(term, 1);

        if(result.items.length === 0)
            throw new Error("No result found");

        const item = result.items[0];

        debug(`found item: ${item.title} - ${item.id}`);

        const url = `https://www.youtube.com/watch?v=${item.id}`;

        this.m_queue.push({
            title: item.title,
            videoUrl: url,
            thumbnailUrl: item.thumbnail.thumbnails[0].url,
            author: item.channelTitle,
            duration: item.length.simpleText,
            requester: options?.requester,
        });

        if(this.m_queue.length > 1)
            return this;

        // play just one time then stops the whole thing
        const connection = joinVoiceChannel({
            channelId: channel.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            guildId: channel.guild.id,
        });

        const player = createAudioPlayer();
        const stream = createYtdlStream(url);
        this.m_currentAudioResource = createAudioResource(stream, {
            // inlineVolume: true,
        });
        this.m_subscription = connection.subscribe(player) ?? null;

        // resource.volume?.setVolume(this.m_volume);

        player.play(this.m_currentAudioResource);

        if(this.m_subscription){
            this.m_subscription.player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
                // stops the stream when the player is idle
                debug(`Player idle: ${oldState.status} -> ${newState.status}`);

                // means the stream is done playing
                if(oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle){ 

                    const item = this.m_queue.shift(); // remove the current stream

                    // if repeat is on, push the current stream to the end of the queue
                    if(this.m_repeat && item)
                        this.m_queue.push(item);

                    // play next in queue
                    if(this.m_queue.length > 0){
                        const newUrl = this.m_queue[0].videoUrl;
                        this.m_currentStream = createYtdlStream(newUrl);
                        const resource = createAudioResource(this.m_currentStream, {
                            // inlineVolume: true,
                        });
                        // resource.volume?.setVolume(this.m_volume);

                        this.m_currentAudioResource = resource;
                
                        player.play(resource);
                        options?.onSongEnd?.();
                    }
                    // or stops the vc, if there is no more queue
                    else{
                        debug("Queue end");

                        if(this.m_subscription)
                            this.m_subscription.connection.destroy();

                        this.m_subscription = null;
                        this.m_currentAudioResource = null;
                        this.m_currentStream = null;

                        options?.onQueueEnd?.();
                    }
                }
            });

            this.m_subscription.player.on(AudioPlayerStatus.Paused, () => {
                debug("Player paused");
            });
        }
    }

    /**
     * Stop the current stream and clear the queue
     * @returns 
     */
    public stop(): boolean{
        if(!this.m_subscription)
            return false;

        // remove timer if stop
        if(this.m_timeout){
            clearTimeout(this.m_timeout);
            this.m_timeout = null;
        }

        this.m_subscription?.connection.destroy();
        this.m_subscription = null;
        this.m_queue = [];
        this.m_currentAudioResource = null;
        this.m_currentStream = null;

        return true;
    }

    /**
     * Pause the current stream
     * @returns 
     */
    public pause(){
        if(!this.m_subscription)
            return false;

        // check if the player is playing
        // if it does, then add a timer to stop the stream after 5 minutes of not playing
        if(this.m_subscription.player.state.status !== AudioPlayerStatus.Playing)
        {
            this.m_timeout = setTimeout(this.stop, this.m_timeoutDurationMs);
        }

        return this.m_subscription.player.pause();
    }

    /**
     * Resume the current stream
     * @returns 
     */
    public resume(){
        if(!this.m_subscription)
            return false;

        // clear the timeout if it exists
        if(this.m_timeout){
            clearTimeout(this.m_timeout);
            this.m_timeout = null;
        }

        return this.m_subscription.player.unpause();
    }

    /**
     * Skip the current stream and play the next stream in the queue
     * @returns 
     */
    public skip(): boolean{
        if(!this.m_subscription)
            return false;

        // remove timer if skip
        if(this.m_timeout){
            clearTimeout(this.m_timeout);
            this.m_timeout = null;
        }

        return this.m_subscription.player.stop();
    }

    /**
     * removes a queue item by index, index starts from 1
     * cannot remove the current stream, use skip instead
     * @param index 
     * @returns 
     */
    public removeQueue(index: number): DiscordYtPlayerItem | undefined{
        if(index < 1 || index > this.m_queue.length)
            return;

        return this.m_queue.splice(index, 1)[0];
    }
}