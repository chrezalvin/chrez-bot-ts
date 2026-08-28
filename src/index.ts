import "./bot";
import "./autoWorkers";
import "./server";

process.on("unhandledRejection", async (error, _) => {
    if(error instanceof Error)
        console.log(`fatal error: ${error.message} ${error.stack}`);
    else
        console.log(`fatal error: ${error}`);
})