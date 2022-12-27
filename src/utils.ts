import "reflect-metadata";
import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { HandlerType } from "./enums";

export function ClassToBot(target: any): Telegraf<Context> {
    let bot = new Telegraf(Reflect.getMetadata('bot.token', target));

    let handlers = Object.getOwnPropertyNames(target.prototype)
                                                .filter(key => key !== 'constructor')
                                                .map(i => target.prototype[i])
                                                .map(i => Reflect.getMetadataKeys(i).map(key => Reflect.getMetadata(key, i)))

    handlers.forEach(handler => {
        if (handler[0] === HandlerType.Command) {
            bot.command(handler[1], handler[2]);
        } else if (handler[0] === HandlerType.Event) {
            bot.on(handler[1], handler[2]);
        }
    });

    return bot;
}