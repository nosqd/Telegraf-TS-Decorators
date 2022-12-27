import "dotenv/config";
import { Context, Telegraf, Markup, Scenes, session } from "telegraf";
import { Bot, Command, ClassToBot, Event, Scene, Action, ClassToScene, Enter, Leave } from "../src";

@Scene({
    enableLeaveCommand: true,
    leaveCommandName: "cancel"
})
class DevScene {
    @Enter()
    async enter(ctx: Context) {
        await ctx.reply('You have entered the scene');
    }

    @Leave()
    async leave(ctx: Context) {
        await ctx.reply('You have left the scene');
    }
}

let devbotscene = ClassToScene(DevScene);

@Bot({
    token: process.env.BOT_TOKEN as string,
    middlewares: [
        session()
    ]
})
class DevBot {
    @Command('ping')
    async ping(ctx: Context) {
        return await ctx.reply('pong');
    }

    @Command('start')
    async start(ctx: Context) {
        return await ctx.reply('Hello, I am a bot', Markup.inlineKeyboard([
            Markup.button.callback('Start', 'start'),
        ]));
    }

    @Action('start')
    async start_action(ctx: Scenes.SceneContext) {
        await ctx.scene.enter(devbotscene.id);
    }

    @Event('message')
    async message(ctx: Context) {
        return await ctx.reply('I don`t know what to do with this message');
    }
}

let bot = ClassToBot(DevBot);
bot.stage?.register(devbotscene);
bot.launch();