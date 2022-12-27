import "dotenv/config";
import { Context, Telegraf, Markup, Scenes, session } from "telegraf";
import { Bot, Command, ClassToBot, Event, Scene, Action, ClassToScene, Enter, Leave } from "../src";

@Scene({
    enableLeaveCommand: true,
    leaveCommandName: "cancel"
})
class ExampleScene {
    @Enter()
    async enter(ctx: Context) {
        await ctx.reply('You have entered the scene');
    }

    @Leave()
    async leave(ctx: Context) {
        await ctx.reply('You have left the scene');
    }
}

let ExampleSceneC = ClassToScene(ExampleScene);

@Bot({
    token: process.env.BOT_TOKEN as string,
    middlewares: [
        session()
    ]
})
class ExampleBot {
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
        await ctx.scene.enter(ExampleSceneC.id);
    }

    @Event('message')
    async message(ctx: Context) {
        return await ctx.reply('I don`t know what to do with this message');
    }
}

let bot = ClassToBot(ExampleBot);
bot.stage?.register(ExampleSceneC);
bot.launch();