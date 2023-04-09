// Here I tell node.js mineflayer and a few other plugins are required to load
import { createBot } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { commands, setup as setupCmds } from './lib/commands.js';
import { setup as setupMfUtils } from './lib/mineflayer-utils.js';
const { pathfinder, Movements } = pathfinderPkg;

// Here, we set up the server connection (in this case, my skin plugin server)
export const bot = createBot({
	host: 'SonicJavaBots.aternos.me',
	port: 37867,
	username: 'SonicandTailsCDb',
	version: '1.18.2'
});

setupMfUtils(bot);
setupCmds(bot);

// Setup pathfinder
bot.loadPlugin(pathfinder);
const movements = new Movements(bot, bot.registry);
bot.pathfinder.setMovements(movements);
bot.pathfinder.thinkTimeout = 10000;
bot.pathfinder.tickTimeout = 22

// And now, we work on the AI here!
// Here's all of the functions:
// One note tho: All functions are placeholders.
// function onPhysicsTick (): void {}

function onSpawn (): void {
	bot.chat('/skin set SonicandTailsCDb robot1_alextest');
	console.log('The skin was set successfully!')
	bot.chat("Hey! I'm working properly :D");

	bot.on('chat', async (daname, msg) => {
		if (daname === 'SkinsRestorer') return;
		console.log(daname + ' said: ' + msg);
		if (msg === 'follow me') {
			while (commands.followMe(daname)) {
				console.log('I started following ' + daname);
				return;
			};
		}
		if (msg === 'Sleep with me :)') {
			await commands.sleep();
		}
		if (msg === 'eat with me') {
			commands.eatWithPlayer(daname)
		}
		if (msg === 'CLEEANN!') {
			await commands.mineAround();
		}
		if (msg === 'Stop cleaning') {
			await commands.stopMining();
		}
		if (msg === 'attack me') {
			const message = "Alright, run while you still can!"
			bot.chat(message)
			commands.attackPlayer(daname)
		}
		if (msg === 'attack any entity') {
			commands.attackEntity()
		}
		if (msg === 'hey') {
			bot.chat('what you want?');
			console.log('I said: what you want?');
		}
		if (msg === 'Say hi to 678435021') {
			bot.chat("Oh, I'm sorry! Hi 678435021! :)")
		}
		if (msg === 'stop following me') {
			commands.unFollowMe();
			console.log('I stopped following ' + daname);
		}
	});
}

// I'm unsure on how am I gonna use onPhysicsTick function but I'll leave it there in case me or @678435021 wanna use it.
// bot.on('physicsTick', onPhysicsTick);

// Next, I'm gonna set spawn actions.
bot.once('spawn', onSpawn);
