const debug = require("debug")("library:discord-yt-player");

import { spawn } from "child_process";
import internal from "stream";
import { VoiceBasedChannel } from "discord.js";
import { searchYoutube } from "./YoutubeSearch";
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, PlayerSubscription, VoiceConnectionStatus } from "@discordjs/voice";

function createYtdlStream(videoUrl: string): internal.Readable {
    return spawn("ytdl", ["-f", "bestaudio", "--rm-cache-dir", "-o", "-", videoUrl]).stdout;
}

export interface DiscordYtPlayerItem{
    title: string;
    videoUrl: string;
    thumbnailUrl?: string;
    author: string;
}

export default class DiscordYtPlayer{
    // queue of the stream, queue[0] is the current stream
    private m_queue: DiscordYtPlayerItem[] = [];
    private m_subscription: PlayerSubscription | null = null;

    constructor(){}

    // getter
    public get queue(){ return this.m_queue; }

    /**
     * Play a youtube audio stream, if there is a stream currently playing, it will be queued
     * @param url youtube video url
     * @returns 
     */
    public async play(
            term: string, 
            channel: VoiceBasedChannel, 
            options?: {
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
        const resource = createAudioResource(stream);

        player.play(resource);

        this.m_subscription = connection.subscribe(player) ?? null;

        if(this.m_subscription){
            this.m_subscription.connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
                // starts playing the stream when the connection is ready
                debug(`Connection ready: ${oldState.status} -> ${newState.status}`);
            });
    
            this.m_subscription.connection.on(VoiceConnectionStatus.Disconnected, () => {
                // stops the stream when the connection is disconnected
    
                debug("Connection disconnected");
            });
            

            this.m_subscription.player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
                // stops the stream when the player is idle
                debug(`Player idle: ${oldState.status} -> ${newState.status}`);

                // means the stream is done playing
                if(oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle){ 
                    this.m_queue.shift(); // remove the current stream

                    // play next in queue
                    if(this.m_queue.length > 0){
                        const newUrl = this.m_queue[0].videoUrl;
                        const stream = createYtdlStream(newUrl);
                        const resource = createAudioResource(stream);
                
                        player.play(resource);
                        options?.onSongEnd?.();
                    }
                    // or stops the vc, if there is no more queue
                    else{
                        if(this.m_subscription)
                            this.m_subscription.connection.destroy();
                        this.m_subscription = null;
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

        this.m_subscription?.connection.destroy();
        this.m_subscription = null;
        this.m_queue = [];

        return true;
    }

    /**
     * Pause the current stream
     * @returns 
     */
    public pause(){
        if(!this.m_subscription)
            return false;

        return this.m_subscription.player.pause();
    }

    /**
     * Resume the current stream
     * @returns 
     */
    public resume(){
        if(!this.m_subscription)
            return false;
        return this.m_subscription.player.unpause();
    }

    /**
     * Skip the current stream and play the next stream in the queue
     * @returns 
     */
    public skip(): boolean{
        if(!this.m_subscription)
            return false;

        return this.m_subscription.player.stop();
    }

    /**
     * removes a queue item by index, index starts from 1, cannot remove the current stream
     * @param index 
     * @returns 
     */
    public removeQueue(index: number){
        if(index < 1 || index > this.m_queue.length)
            return false;

        this.m_queue.splice(index, 1);

        return true;
    }
}