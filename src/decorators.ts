import "reflect-metadata";
import "dotenv/config";
import { Context, Telegraf } from "telegraf";
import { HandlerType } from "./enums";

export function Bot({ token = '' }: { token: string }) {
    return function (target: Function) {
        Reflect.defineMetadata('bot', true, target);
        Reflect.defineMetadata('bot.token', token, target);
    }
}

export function Command(name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('type', HandlerType.Command, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('command.name', name, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('command.handler', target.constructor.prototype[propertyKey], target.constructor.prototype[propertyKey]);
    }
}

export function Event(event_name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('type', HandlerType.Event, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('event.name', event_name, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('event.handler', target.constructor.prototype[propertyKey], target.constructor.prototype[propertyKey]);
    }
}
