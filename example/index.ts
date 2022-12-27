import "dotenv/config";
import { Context, Telegraf, Markup, Scenes, session } from "telegraf";
import { Bot, Command, ClassToBot, Event, Scene, Action, ClassToScene, Enter, Leave } from "../src";

interface SessionData {
	counter: number;
	// ... more session data go here
}

// Define your own context type
interface MyContext {
	session?: SessionData;
	// ... more props go here
}

type MyContextType = Scenes.SceneContext & MyContext & Context;

@Bot({
    token: process.env.BOT_TOKEN as string,
    middlewares: [
        session()
    ]
})
class ExampleBot {
    @Command('start')
    async start(ctx: MyContextType) {
        if (ctx?.session?.counter === undefined) {
            ctx.session.counter = 0;
        }
        ctx.session.counter += 1;
        return await ctx.reply(`Hello World! (x${ctx?.session?.counter ?? 0})`);
    }
}

let bot = ClassToBot(ExampleBot);
bot.launch();