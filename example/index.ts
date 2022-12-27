import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Bot, Command, launchBot } from "../src";

@Bot({
    token: process.env.BOT_TOKEN as string
})
class DevBot {
    @Command({
        name: 'ping'
    })
    ping(ctx: Context) {
        return ctx.reply('pong');
    }
}

launchBot(DevBot);