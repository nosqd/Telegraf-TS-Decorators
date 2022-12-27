import "reflect-metadata";
import "dotenv/config";
import { Context, Telegraf, Middleware } from "telegraf";
import { BaseHandlerType, EntityType, SceneHandlerType } from "./enums";

export function Bot({ token = '', middlewares = [] }: { token: string, middlewares?: any[] }) {
    return function (target: Function) {
        Reflect.defineMetadata('type', EntityType.Bot, target);
        Reflect.defineMetadata('bot.token', token, target);
        Reflect.defineMetadata('bot.middlewares', middlewares, target);
    }
}

function eventDecorator(type: BaseHandlerType | SceneHandlerType, name: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('type', type, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('name', name, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('handler', target.constructor.prototype[propertyKey], target.constructor.prototype[propertyKey]);
    }
}

function sceneEventDecorator(type: BaseHandlerType | SceneHandlerType) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata('type', type, target.constructor.prototype[propertyKey]);
        Reflect.defineMetadata('handler', target.constructor.prototype[propertyKey], target.constructor.prototype[propertyKey]);
    }
}

export function Command(name: string) {
    return eventDecorator(BaseHandlerType.Command, name);
}

export function Event(name: string) {
    return eventDecorator(BaseHandlerType.Event, name);
}

export function Action(name: string) {
    return eventDecorator(BaseHandlerType.Action, name);
}

export function Enter() {
    return sceneEventDecorator(SceneHandlerType.Enter);
}

export function Leave() {
    return sceneEventDecorator(SceneHandlerType.Leave);
}

export function Scene({
    enableLeaveCommand = false,
    leaveCommandName = 'leave',
} = {}) {
    return function (target: Function) {
        Reflect.defineMetadata('type', EntityType.Scene, target);
        Reflect.defineMetadata('scene.enableLeaveCommand', enableLeaveCommand, target);
        Reflect.defineMetadata('scene.leaveCommandName', leaveCommandName, target);
    }
}