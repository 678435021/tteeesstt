import { createBot } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { commands, setup as setupCmds } from './lib/commands.js';
import { setup as setupMfUtils } from './lib/mineflayer-utils.js';
const { pathfinder, Movements } = pathfinderPkg;
console.log('Registering the bot and allowing node to control it...');
export const bot = createBot({
    host: 'SonicJavaBots.aternos.me',
    port: 37867,
    username: 'SonicandTailsCDb',
    version: '1.18.2'
});
const ownersList = ["SonicandTailsCD", "SonicandTailsCD1", "SonicandTailsCDt", "678435921"];
console.log('Bot client initialized!');
console.log('Node.JS can control the bot now.');
console.log('Setting up MfUtils and Cmds');
setupMfUtils(bot);
setupCmds(bot);
console.log('Done :)');
console.log('Setting up pathfinder...');
bot.loadPlugin(pathfinder);
const movements = new Movements(bot, bot.registry);
bot.pathfinder.setMovements(movements);
bot.pathfinder.thinkTimeout = 10000;
bot.pathfinder.tickTimeout = 22;
console.log('Done :)');
console.log('Registering function...');
function onSpawn() {
    bot.chat('/skin set SonicandTailsCDb robot1_alextest');
    console.log('Bot initialized completely :)');
    bot.chat("Hey! I'm working properly :D");
    bot.on('chat', async (daname, msg) => {
        if (daname === 'SkinsRestorer')
            return;
        console.log(daname + ' said: ' + msg);
        if (msg === 'hello') {
            bot.chat('Hi! :)');
        }
        if (msg === 'Where are you, bot?') {
            console.log('Bot is giving its location to ' + daname + '!');
            commands.location(daname);
        }
        if (msg === 'Hey, bot?') {
            botCommandMode(daname);
        }
        if (msg === 'hey') {
            bot.chat('what you want?');
            console.log('I said: what you want?');
        }
    });
}
export function botCommandMode(daname) {
    bot.once('chat', async (thename, message) => {
        if (thename != daname) {
            bot.chat('I\'m confused :(');
            return;
        }
        if (message === 'follow me') {
            while (commands.followMe(daname)) {
                console.log('I started following ' + daname);
                return;
            }
        }
        if (message === 'attack me') {
            const message = "Alright, run while you still can!";
            bot.chat(message);
            commands.attackPlayer(daname);
            return;
        }
        if (message === 'Stop attacking me') {
            commands.stopAttacking();
            return;
        }
        if (message === 'attack any entity') {
            commands.attackEntity();
            return;
        }
        if (message === 'Who made you?') {
            bot.chat('Well, I was made by SonicandTailsCD and 678435021. It\'s awesome that SonicandTailsCD and 678435021 collaborated! I believe they\'re here, here you go: ');
            await bot.waitForTicks(200);
            bot.chat('/tp @a[tag=owner] ' + thename);
            bot.chat('Have fun :)');
            bot.whisper("@a[tag=owners]", 'Seems like ' + thename + ' wants to speak with you! :)');
        }
        if (message === 'Say hi to SonicandTailsCD') {
            bot.chat("Oh, I'm sorry! Hi SonicandTailsCD! :)");
        }
        if (message === 'Say hi to 678435021') {
            bot.chat("Oh, I'm sorry! Hi 678435021! :)");
        }
        if (message === 'stop following me') {
            commands.unFollowMe();
            console.log('I stopped following ' + daname);
            return;
        }
        if (message === 'Stop server') {
            switch (thename) {
                case "SonicandTailsCD":
                case "SonicandTailsCD1":
                case "SonicandTailsCDt":
                case "678435021":
                    bot.chat('Okay!');
                    await bot.waitForTicks(60);
                    bot.chat('/stop');
                    return;
            }
            bot.chat('I\'m sorry, but I can\'t do that. Ask an admin to stop the server or ask an admin to give you permission. :(');
            return;
        }
        if (message === 'Reset your viewing location') {
            await bot.chat('Sure, I\'ll do that :)');
            await bot.waitForTicks(10);
            commands.resetViewingLocation();
            return;
        }
        if (message === 'Sleep with me :)') {
            await commands.sleep();
            return;
        }
        if (message === 'eat with me') {
            commands.eatWithPlayer(daname);
            return;
        }
        if (message === 'CLEEANN!') {
            await commands.mineAround();
            return;
        }
        if (message === 'Stop cleaning') {
            await commands.stopMining();
            return;
        }
        if (message === 'Protect me :)') {
            try {
                commands.protectMe(daname);
            }
            catch (err) {
                console.log(String(err?.message));
            }
            console.log('Bot instructed to protect ' + daname + ', obeying player...');
            return;
        }
        if (message === 'Follow me in loose mode') {
            bot.chat('Sure :)');
            while (commands.followMeLooseMode(daname)) {
                console.log('I started following ' + daname + ' in loose mode');
                return;
            }
            return;
        }
        else {
            bot.chat('I\'m sorry, I can\'t understand your prompt :(');
            return;
        }
    });
}
console.log('Done :)');
console.log('Running now!');
bot.once('spawn', onSpawn);
