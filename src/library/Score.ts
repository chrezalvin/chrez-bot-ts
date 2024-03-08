export class Score{
    private m_win: number = 0;
    private m_lose: number = 0;
    private m_draw: number = 0;

    private m_winStreak: number = 0;
    private m_loseStreak: number = 0;
    private m_drawStreak: number = 0;

    constructor(){}

    win(){
        ++this.m_win;
        ++this.m_winStreak;
        this.m_loseStreak = 0;
        this.m_drawStreak = 0;

        return this;
    }

    lose(){
        ++this.m_lose;
        ++this.m_loseStreak;
        this.m_winStreak = 0;
        this.m_drawStreak = 0;

        return this;
    }

    draw(){
        ++this.m_draw;
        ++this.m_drawStreak;

        return this;
    }

    get winRate(){ return this.m_win / (this.m_win + this.m_lose); }
    get loseRate(){ return this.m_lose / (this.m_win + this.m_lose); }
    get drawRate(){ return this.m_draw / (this.m_win + this.m_lose + this.m_draw); }

    get winCount(){ return this.m_win; }
    get loseCount(){ return this.m_lose; }
    get drawCount(){ return this.m_draw; }

    get winStreakCount(){ return this.m_winStreak; }
    get loseStreakCount(){ return this.m_loseStreak; }
    get drawSteakCount(){ return this.m_drawStreak; }
}

export default Score;