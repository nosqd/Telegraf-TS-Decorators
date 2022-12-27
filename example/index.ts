import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Bot, Command, launchBot, Event } from "../src";

@Bot({
    token: process.env.BOT_TOKEN as string
})
class DevBot {
    @Command('ping')
    async ping(ctx: Context) {
        return await ctx.reply('pong');
    }

    @Event('message')
    async message(ctx: Context) {
        return await ctx.reply('I don`t know what to do with this message');
    }
}

launchBot(DevBot);