import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { EventEmitter } from "stream";

export type CloudflaredTunnelEvents = "new_url" | "error";
export class CloudflaredTunnel{
  private readonly CLOUDFLARE_REGEX = /https:\/\/[a-zA-Z0-9.-]+\.trycloudflare\.com/;
  private readonly MAX_RETRY = 3;

  private m_currentUrl: string | null = null;
  private m_tunnelProcess: ChildProcessWithoutNullStreams | null = null;
  private m_events: EventEmitter = new EventEmitter();
  private m_currentRetryCount: number = 0;
  private m_targetUrl: string;

  constructor(targetUrl: string = 'http://localhost:3000'){
    this.m_targetUrl = targetUrl;
    
    this.createNewTunnel();
  }

  private spawnTunnel(): ChildProcessWithoutNullStreams{
    return spawn('cloudflared', ['tunnel', '--url', this.m_targetUrl]);
  }

  private createNewTunnel(){
    if(this.m_tunnelProcess){
      this.m_tunnelProcess.kill("SIGINT");
      this.m_currentUrl = null;
    }

    if (this.m_currentRetryCount >= this.MAX_RETRY) {
      this.m_events.emit("error", new Error("Max retry attempts reached. Tunnel failed to start permanently."));
      return;
    }

    this.m_tunnelProcess = this.spawnTunnel();

        // cloudflared outputs its status/URLs to stderr
    this.m_tunnelProcess.stderr.on('data', (data) => {
        if(this.m_currentUrl) return;

        const match = data.toString().match(this.CLOUDFLARE_REGEX);

        if (match){
          this.m_currentUrl = match[0];
          this.m_events.emit("new_url", match[0]);
        }
    });

    this.m_tunnelProcess.on("error", (error) => {
      this.m_events.emit("error", error);
    });

    // Handle unexpected crashes / network failures
    this.m_tunnelProcess.on("close", (code) => {
      // If code is 0, it was closed intentionally (via .kill())
      if (code !== 0 && code !== null) {
        ++this.m_currentRetryCount;
        this.m_events.emit("error", new Error(`cloudflared exited with code ${code}. Retrying (${this.m_currentRetryCount}/${this.MAX_RETRY})...`));
        
        // Wait 3 seconds before attempting to recreate to prevent slamming CPU/network
        setTimeout(() => this.createNewTunnel(), 3000);
      }
    });
  }

  public kill(signal?: NodeJS.Signals){
    const res = this.m_tunnelProcess?.kill(signal ?? "SIGINT");

    if(!res)
      throw new Error("Failed to kill cloudflared tunnel!");

    this.m_tunnelProcess = null;
    this.m_currentUrl = null;
  }

  public on(event: "new_url", action: (url: string) => void): void;
  public on(event: "error", action: (err: Error) => void): void;
  public on<_T extends CloudflaredTunnelEvents>(event: _T, action: ((error: Error) => void) | ((url: string) => void)){
    this.m_events.addListener(event, action);
  }

  get currentUrl(){
    return this.m_currentUrl;
  }
}

export default CloudflaredTunnel;