import { Bot } from "../classes/Bot";

export function handleExceptions(bot: Bot): void {
  process.on("uncaughtException", (err) => {
    let errorMsg = "";
    if (err.stack) {
      errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    }
    bot.logger.error(`Uncaught Exception: ${errorMsg}`);
    console.error(err);
    process.exit(1);
  });
  process.on("unhandledRejection", (err) => {
    bot.logger.error(`Unhandled rejection: ${err}`);
    console.error(err);
  });
}
