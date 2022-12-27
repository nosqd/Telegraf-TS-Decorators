# Telegraf-TS-Decorators
Decorators for telegraf bot library.

Usage
```typescript
import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { Bot, Command, ClassToBot, Event } from "../src";

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

let bot = ClassToBot(DevBot);
bot.launch();
```

Cheat sheet for features
1. Use `{ enableLeaveCommand: true }` to automatically add `/leave` command to your scene and you can pass `leaveCommandName` to change the command name like cancel