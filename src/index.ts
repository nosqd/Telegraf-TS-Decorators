import "reflect-metadata";
import "dotenv/config";
import { Context, Telegraf } from "telegraf";

function Bot({ token = '' }: { token: string }) {
    return function (target: Function) {
        Reflect.defineMetadata('bot', true, target);
        Reflect.defineMetadata('bot.token', token, target);
    }
}

function Command({ name = '' }: { name: string }) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('command', true, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('command.name', name, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('command.handler', target.constructor.prototype[propertyKey], target.constructor.prototype[propertyKey]);
    }
}

function launchBot(target: any) {
    let bot = new Telegraf(Reflect.getMetadata('bot.token', target));

    let commands = Object.getOwnPropertyNames(target.prototype)
                                                .filter(key => key !== 'constructor')
                                                .map(i => target.prototype[i])
                                                .map(i => Reflect.getMetadataKeys(i).map(key => Reflect.getMetadata(key, i)))
                                                .map(i => {return {name: i[1], handler: i[2]}});

    commands.forEach(command => {
        bot.command(command.name, command.handler);
    });

    bot.launch();
}