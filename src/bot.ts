// Here I tell node.js mineflayer and a few other plugins are required to load
import { createBot } from 'mineflayer';
import pathfinderPkg from 'mineflayer-pathfinder';
import { botStates, commands, setup as setupCmds } from './lib/commands.js';
import { setup as setupMfUtils } from './lib/mineflayer-utils.js';
const { pathfinder, Movements } = pathfinderPkg;
import { lookAtEntity } from './lib/mineflayer-utils.js';

// Here, we set up the server connection (in this case, my skin plugin server)
console.log('Registering the bot and allowing node to control it...')
export const bot = createBot({
	host: 'SonicJavaBots.aternos.me',
	port: 37867,
	username: 'SonicandTailsCDb',
	version: '1.18.2'
});
const ownersList = ["SonicandTailsCD", "SonicandTailsCD1", "SonicandTailsCDt", "678435921"]
console.log('Bot client initialized!');
console.log('Node.JS can control the bot now.')
console.log('Setting up MfUtils and Cmds')
setupMfUtils(bot);
setupCmds(bot);
console.log('Done :)')

// Setup pathfinder
console.log('Setting up pathfinder...')
bot.loadPlugin(pathfinder);
const movements = new Movements(bot, bot.registry);
bot.pathfinder.setMovements(movements);
bot.pathfinder.thinkTimeout = 10000;
bot.pathfinder.tickTimeout = 22
console.log('Done :)')

// And now, we work on the AI here!
// Here's all of the functions:
// One note tho: All functions are placeholders.
// function onPhysicsTick (): void {}

console.log('Registering function...')
function onSpawn (): void {
	bot.chat('/skin set SonicandTailsCDb robot1_alextest');
	console.log('Bot initialized completely :)');
	bot.chat("Hey! I'm working properly :D");

	bot.on('chat', async (daname, msg) => {
		if (daname === 'SkinsRestorer') return;
		console.log(daname + ' said: ' + msg);
		if (msg === 'hello') {
			bot.chat('Hi! :)')
		}
		if (msg === 'Where are you, bot?') {
			console.log('Bot is giving its location to ' + daname + '!')
			commands.location(daname)
		}
		if (msg === 'Hey, bot?') {
			await bot.chat('/execute as ' + daname + ' at @s run tp ' + bot.username + ' ^ ^ ^-1 facing entity ' + daname)
			await bot.waitForTicks(20)
			const player = bot.players[daname]
			bot.chat('What\'s up? :)')
			await bot.waitForTicks(20)
			botCommandMode(daname)
			while (botStates.commandMode = true) {
				await bot.waitForTicks(4)
				bot.lookAt(
					player.entity.position.offset(0, player.entity.height, 0), true
				)
			}
		}
		if (msg === 'What\'s the current state of botStates.commandMode?') {
			if (botStates.commandMode === true) {
				bot.chat("It\'s set to true :)")
			}
			else {
				bot.chat("It\'s set to false :)")
			}
		}
		if (msg === 'hey') {
			bot.chat('what you want?');
			console.log('I said: what you want?');
		}
	});
}
export function botCommandMode (daname: string) {
	botStates.commandMode = true
	bot.once('chat', async (thename, message) => {
		if (thename != daname) {
			bot.chat('I\'m confused :(')
			botStates.commandMode = false
			return;
		}
		if (message === 'follow me') {
			botStates.commandMode = false
			while (commands.followMe(daname)) {
				console.log('I started following ' + daname);
				return;
			}
		}
		if (message === 'attack me') {
			botStates.commandMode = false
			const message = "Alright, run while you still can!"
			bot.chat(message)
			commands.attackPlayer(daname)
			return;
		}
		if (message === 'Stop attacking me') {
			botStates.commandMode = false
			commands.stopAttacking()
			return;
		}
		if (message === 'attack any entity') {
			botStates.commandMode = false
			commands.attackEntity()
			return;
		}
		if (message === 'Who made you?') {
			bot.chat('Well, I was made by SonicandTailsCD and 678435021. It\'s awesome that SonicandTailsCD and 678435021 collaborated! I believe they\'re here, here you go: ')
			await bot.waitForTicks(200)
			bot.chat('/tp @a[tag=owner] ' + thename)
			bot.chat('Have fun :)')
			bot.whisper("@a[tag=owners]", 'Seems like ' + thename + ' wants to speak with you! :)')
			botStates.commandMode = false
			return
		}
		if (message === 'Say hi to SonicandTailsCD') {
			bot.chat("Oh, I'm sorry! Hi SonicandTailsCD! :)")
			botStates.commandMode = false
			return
		}
		if (message === 'Say hi to 678435021') {
			bot.chat("Oh, I'm sorry! Hi 678435021! :)")
			botStates.commandMode = false
			return
		}
		if (message === 'stop following me') {
			commands.unFollowMe();
			console.log('I stopped following ' + daname);
			botStates.commandMode = false
			return;
		}
		if (message === 'Stop server') {
			switch (thename) {
				case "SonicandTailsCD":
					case "SonicandTailsCD1":
						case "SonicandTailsCDt":
							case "678435021":
								bot.chat('Okay!')
								await bot.waitForTicks(60)
								bot.chat('/stop')
								return
			}
			bot.chat('I\'m sorry, but I can\'t do that. Ask an admin to stop the server or ask an admin to give you permission. :(')
			botStates.commandMode = false
			return;
		}
		if (message === 'Reset your viewing location') {
			botStates.commandMode = false
			await bot.chat('Sure, I\'ll do that :)')
			await bot.waitForTicks(10)
			commands.resetViewingLocation()
			return;
		}
		if (message === 'Sleep with me :)') {
			botStates.commandMode = false
			await commands.sleep();
			return;
		}
		if (message === 'eat with me') {
			commands.eatWithPlayer(daname)
			botStates.commandMode = false
			return
		}
		if (message === 'What\'s the current state of botStates.commandMode?') {
			if (botStates.commandMode === true) {
				bot.chat("It\'s set to true :)")
			}
			else {
				bot.chat("It\'s set to false :)")
			}
			botStates.commandMode = false
			return;
		}
		if (message === 'CLEEANN!') {
			botStates.commandMode = false
			await commands.mineAround();
			return;
		}
		if (message === 'Stop cleaning') {
			botStates.commandMode = false
			await commands.stopMining();
			return;
		}
		if (message === 'Protect me :)') {
			try {
				commands.protectMe(daname)
			}
			catch (err) {
				console.log(String(err?.message))
			}
			botStates.commandMode = false
			console.log('Bot instructed to protect ' + daname + ', obeying player...')
			return;
		}
		if (message === 'Follow me in loose mode') {
			bot.chat('Sure :)')
			botStates.commandMode = false
			while (commands.followMeLooseMode(daname)) {
				console.log('I started following ' + daname + ' in loose mode');
				return;
			}
			return;
		}
		else {
			botStates.commandMode = false
			bot.chat('I\'m sorry, I can\'t understand your prompt :(')
			return;
		}
	})
	return
}
console.log('Done :)')

// I'm unsure on how am I gonna use onPhysicsTick function but I'll leave it there in case me or @678435021 wanna use it.
// bot.on('physicsTick', onPhysicsTick);

// Next, I'm gonna set spawn actions.
console.log('Running now!')
bot.once('spawn', onSpawn);
