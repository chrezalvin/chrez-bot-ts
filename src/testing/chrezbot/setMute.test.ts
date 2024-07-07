import { GlobalState } from "@shared/GlobalState";

describe("Testing GlobalState at setMute", () => {
    test("test setMute to true", () => {
        GlobalState.setMute(true);
        expect(GlobalState.isMuted).toBe(true);
    });

    test("test setMute to false", () => {
        GlobalState.setMute(false);
        expect(GlobalState.isMuted).toBe(false);
    });

    test("test setMute to true with callback", async () => {
        const callback = jest.fn();

        GlobalState.setMute(true, {
            callback,
            timeMs: 1000
        });

        // true before the callback is called
        expect(GlobalState.isMuted).toBe(true);

        // wait for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        // expect isMuted have been automatically set to false after 1 second
        expect(GlobalState.isMuted).toBe(false);
        expect(callback).toHaveBeenCalled();
    });
})