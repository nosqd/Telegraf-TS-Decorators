import "reflect-metadata";
import "dotenv/config";
import { Context, Telegraf } from "telegraf";

function Bot({ token = '' }: { token: string }) {
    return function (target: Function) {
        Reflect.defineMetadata('bot', true, target);
        Reflect.defineMetadata('bot.token', token, target);
    }
}

enum HandlerType {
    Command,
    Event
}

function Command(name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('type', HandlerType.Command, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('command.name', name, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('command.handler', target.constructor.prototype[propertyKey], target.constructor.prototype[propertyKey]);
    }
}

function Event(event_name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('type', HandlerType.Event, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('event.name', event_name, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('event.handler', target.constructor.prototype[propertyKey], target.constructor.prototype[propertyKey]);
    }
}

function launchBot(target: any) {
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

    bot.launch();
}

export { Bot, Command, Event, launchBot };