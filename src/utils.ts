import "reflect-metadata";
import "dotenv/config";
import { Context, Telegraf, Scenes, session } from "telegraf";
import { BaseHandlerType, EntityType, SceneHandlerType } from "./enums";

function configureBase(target: any, handlers: any[]) {
    handlers.forEach(handler => {
        if (handler[0] === BaseHandlerType.Command) {
            target.command(handler[1], handler[2]);
        } else if (handler[0] === BaseHandlerType.Event) {
            target.on(handler[1], handler[2]);
        } else if (handler[0] === BaseHandlerType.Action) {
            target.action(handler[1], handler[2]);
        }
    });
}

type BotConfig = {
    stage?: Scenes.Stage<Scenes.SceneContext>;
}

export function ClassToBot(target: any): Telegraf<Scenes.SceneContext> & BotConfig {
    let type = Reflect.getMetadata('type', target);

    if (type !== EntityType.Bot) {
        throw new Error('Class is not a bot');
    }

    let bot: Telegraf<Scenes.SceneContext> & BotConfig = new Telegraf<Scenes.SceneContext>(Reflect.getMetadata('bot.token', target));

    let middlewares = (Reflect.getMetadata('bot.middlewares', target) || []) as any[];
    for (const middleware of middlewares) {
        bot.use(middleware);
    }

    let stage = new Scenes.Stage<Scenes.SceneContext>([], {
        ttl: 10,
    });
    bot.use(stage.middleware());


    let handlers = Object.getOwnPropertyNames(target.prototype)
        .filter(key => key !== 'constructor')
        .map(i => target.prototype[i])
        .map(i => Reflect.getMetadataKeys(i).map(key => Reflect.getMetadata(key, i)))

    configureBase(bot, handlers);

    bot.stage = stage;

    return bot;
}

function configureScene(target: Scenes.BaseScene<Scenes.SceneContext>, handlers: any[]) {
    handlers.forEach(handler => {
        if (handler[0] === SceneHandlerType.Enter) {
            target.enter(handler[1]);
        }
        else if (handler[0] === SceneHandlerType.Leave) {
            target.leave(handler[1]);
        }
    });
}

export function ClassToScene(target: any): Scenes.BaseScene<Scenes.SceneContext> {
    let scene = new Scenes.BaseScene<Scenes.SceneContext>(target.name);

    let type = Reflect.getMetadata('type', target);

    if (type !== EntityType.Scene) {
        throw new Error('Class is not a scene');
    }

    let enableLeaveCommand = Reflect.getMetadata('scene.enableLeaveCommand', target);
    let leaveCommandName = Reflect.getMetadata('scene.leaveCommandName', target);

    let handlers = Object.getOwnPropertyNames(target.prototype)
        .filter(key => key !== 'constructor')
        .map(i => target.prototype[i])
        .map(i => Reflect.getMetadataKeys(i).map(key => Reflect.getMetadata(key, i)))

    if (enableLeaveCommand) {
        scene.command(leaveCommandName, (ctx) => {
            ctx.scene.leave();
        });
    }

    configureBase(scene, handlers);
    configureScene(scene, handlers);

    return scene;
}