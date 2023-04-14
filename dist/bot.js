import { createBot } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { commands, setup as setupCmds } from './lib/commands.js';
import { setup as setupMfUtils } from './lib/mineflayer-utils.js';
const { pathfinder, Movements } = pathfinderPkg;
export const bot = createBot({
    host: 'SonicJavaBots.aternos.me',
    port: 37867,
    username: 'SonicandTailsCDb',
    version: '1.18.2'
});
setupMfUtils(bot);
setupCmds(bot);
bot.loadPlugin(pathfinder);
const movements = new Movements(bot, bot.registry);
bot.pathfinder.setMovements(movements);
bot.pathfinder.thinkTimeout = 10000;
bot.pathfinder.tickTimeout = 22;
function onSpawn() {
    bot.chat('/skin set SonicandTailsCDb robot1_alextest');
    console.log('The skin was set successfully!');
    bot.chat("Hey! I'm working properly :D");
    bot.on('chat', async (daname, msg) => {
        if (daname === 'SkinsRestorer')
            return;
        console.log(daname + ' said: ' + msg);
        if (msg === 'follow me') {
            while (commands.followMe(daname)) {
                console.log('I started following ' + daname);
                return;
            }
        }
        if (msg === 'Where are you, bot?') {
            console.log('Bot is giving its location to ' + daname + '!');
            commands.location(daname);
        }
        if (msg === 'Sleep with me :)') {
            await commands.sleep();
        }
        if (msg === 'eat with me') {
            commands.eatWithPlayer(daname);
        }
        if (msg === 'CLEEANN!') {
            await commands.mineAround();
        }
        if (msg === 'Stop cleaning') {
            await commands.stopMining();
        }
        if (msg === 'attack me') {
            const message = "Alright, run while you still can!";
            bot.chat(message);
            commands.attackPlayer(daname);
        }
        if (msg === 'Stop attacking me') {
            commands.stopAttacking();
        }
        if (msg === 'attack any entity') {
            commands.attackEntity();
        }
        if (msg === 'hey') {
            bot.chat('what you want?');
            console.log('I said: what you want?');
        }
        if (msg === 'Say hi to 678435021') {
            bot.chat("Oh, I'm sorry! Hi 678435021! :)");
        }
        if (msg === 'stop following me') {
            commands.unFollowMe();
            console.log('I stopped following ' + daname);
        }
    });
}
bot.once('spawn', onSpawn);
