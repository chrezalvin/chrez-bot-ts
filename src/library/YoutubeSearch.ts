import internal from "stream";
import { spawn } from "child_process";

export function createYtdlStream(videoUrl: string): internal.Readable {
    return spawn("yt-dlp", ["-f", "bestaudio", "--rm-cache-dir", "-o", "-", videoUrl]).stdout;
}