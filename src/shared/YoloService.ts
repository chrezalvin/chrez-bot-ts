import { YOLOService } from "@library";
import { BOT_DETECTION_WAITING_TIME } from "@config";

export const yoloService = new YOLOService({
    // production is termux-based and takes much longer to do a detection
    timeout: BOT_DETECTION_WAITING_TIME * 1000,
});