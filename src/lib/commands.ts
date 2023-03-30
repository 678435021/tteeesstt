import { lookAtEntity } from './mineflayer-utils.js';
import { sleep } from './sleep.js';
import pathfinderPkg from 'mineflayer-pathfinder';
import { type Bot } from 'mineflayer';
const { goals } = pathfinderPkg;

let bot: Bot;
export function setup (_bot: Bot): void {
	bot = _bot;
}

// Add more here when needed
export const botStates = {
	moving: false,
	looking: false,
	mining: false
};

export const commands = {
	async sleep () {
		console.log('Sleeping!');
		bot.chat("I'm coming :D");
		const bed = bot.findBlock({ matching: block => bot.isABed(block) });
		if (!bed) {
			console.log("Sorry, I can't find a bed!");
			return;
		}
		await bot.sleep(bed);
	},
	async stopMining () {
		bot.chat('Okay');
		botStates.mining = false;
	},
	async mineAround () {
		if (botStates.mining) {
			return;
		}

		bot.chat('Anything for you! :)');

		botStates.mining = true;
		while (botStates.mining) {
			await bot.waitForTicks(1);
			const grassBlock = bot.findBlock({
				matching: block => {
					return block.name === 'grass' || block.name === 'tall_grass';
				}
			});

			if (!grassBlock) {
				console.log("Couldn't find grass.");
				await sleep(100);
				continue;
			}

			try {
				await bot.pathfinder.goto(new goals.GoalLookAtBlock(grassBlock.position, bot.world, {
					reach: 2.5,
					entityHeight: bot.player.entity.height
				}));
			} catch (e) {
				continue;
			}

			await bot.dig(grassBlock, true);
		}
	},
	async followMe (daname: string) {
		this.followMe.following = true;

		const player = bot.players[daname];
		if (botStates.moving) {
			bot.chat("Sorry, can't run this command more than once!");
		}
		botStates.moving = true;

		if (!player?.entity) {
			bot.chat("I can't see you, " + daname);
			return;
		}

		bot.chat('Okay ' + daname);

		const range = 4;
		while (this.followMe.following) {
			if (bot.entity.position.distanceTo(player.entity.position) + 0.15 <= range) {
				await lookAtEntity(player.entity, true);
			}
			await sleep(200);
			const goal = new goals.GoalFollow(player.entity, range);
			try {
				await bot.pathfinder.goto(goal);
			} catch (err) {
				bot.chat(String(err?.message));
			}
		}
	},
	unFollowMe () {
		if (!botStates.moving) {
			return;
		}
		botStates.moving = false;

		this.followMe.following = false;
		bot.pathfinder.stop();
	}
};
