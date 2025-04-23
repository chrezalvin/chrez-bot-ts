import { YOLOService } from "@library";
import { MODE } from "@config";

export const yoloService = new YOLOService({
    // production is termux-based and takes much longer to do a detection
    timeout: MODE === "development" ? 5000 : 30000,
});