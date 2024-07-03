export default class ChrezBotError extends Error {
    protected m_code: number;

    static isChrezBotError(err: unknown): err is ChrezBotError {
        return err instanceof ChrezBotError;
    }

    constructor(message: string, code: number) {
        super(message);
        this.name = 'ChrezBotError';
        this.m_code = code;
    }

    get code() {
        return this.m_code;
    }
}