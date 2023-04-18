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
        if (msg === 'follow me') {
            while (commands.followMe(daname)) {
                console.log('I started following ' + daname);
                return;
            }
        }
        if (msg === 'Follow me in loose mode') {
            bot.chat('Sure :)');
            while (commands.followMeLooseMode(daname)) {
                console.log('I started following ' + daname + ' in loose mode');
                return;
            }
        }
        if (msg === 'hello') {
            bot.chat('Hi! :)');
        }
        if (msg === 'Reset your viewing location') {
            await bot.chat('Sure, I\'ll do that :)');
            await bot.waitForTicks(10);
            commands.resetViewingLocation();
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
        if (msg === 'Protect me :)') {
            try {
                commands.protectMe(daname);
            }
            catch (err) {
                console.log(String(err?.message));
            }
            console.log('Bot instructed to protect ' + daname + ', obeying player...');
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
        if (msg === 'Stop server') {
            bot.chat('Okay!');
            await bot.waitForTicks(60);
            bot.chat('/stop');
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
console.log('Done :)');
console.log('Running now!');
bot.once('spawn', onSpawn);
