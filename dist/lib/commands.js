import { lookAtEntity } from './mineflayer-utils.js';
import { sleep } from './sleep.js';
import pathfinderPkg from 'mineflayer-pathfinder';
const { goals } = pathfinderPkg;
let bot;
export function setup(_bot) {
    bot = _bot;
}
export const botStates = {
    moving: false,
    looking: false,
    mining: false,
    following: false,
    mentionedEatingWithPlayerAlready: false,
    attacking: false
};
export const values = {};
export const commands = {
    async sleep() {
        try {
            console.log('Sleeping!');
            bot.chat("I'm coming :D");
            const bed = bot.findBlock({ matching: block => bot.isABed(block) });
            if (!bed) {
                console.log("Sorry, I can't find a bed!");
                return;
            }
            await bot.sleep(bed);
        }
        catch (err) {
            bot.chat('Sorry, I couldn\'t sleep! Please check the console log.');
            console.log(String(err?.message));
        }
    },
    async location(daname) {
        bot.chat(daname + ", I\'m at " + bot.entity.position);
    },
    async stopMining() {
        bot.chat('Okay! I\'ll stop.');
        botStates.mining = false;
    },
    async protectMe (daname) {
		botStates.guarding = true
		if (botStates.following = true) {
			console.log('Already following a player, skipping follow activation!')
			if (player =! daname) {
				bot.chat('You\'re not the one I\'m following! I\'m not obeying you. >:(')
				return
			}
			const protectUser = daname;
			this.speakProtect()
		}
		else {
			console.log('Since the bot isn\'t following anything, the bot will begin following ' + daname)
			this.followMe(daname)
			this.speakProtect()
			const player = bot.players[daname];
			const protectUser = player
		}
		bot.on('entityHurt', async (entity)=>{
			try {
				if (entity.username != protectUser) return
				botStates.attacking = true
				bot.setControlState('forward', true)
				bot.setControlState('sprint', true)
				const location = entity.position
				while (botStates.attacking = true) {
					await bot.waitForTicks(5)
					let distance = bot.entity.position.xzDistanceTo(location)
					if (distance = values.BlocksAwayFromTarget) {
						bot.attack(entity)
					}
					bot.lookAt(location)
				}
			}
			catch (err) {
				console.log('The bot wasn\'t able to help ' + protectUser + ' fight! :(')
			}
		})
	},
    async attackPlayer(daname) {
        const player = bot.players[daname];
        if (!player || !player.entity) {
            bot.chat('I can\'t see you');
        }
        else {
            bot.chat(`Attacking ${player.username}`);
            botStates.attacking = true;
            while (botStates.attacking = true) {
                await bot.waitForTicks(5);
                bot.attack(player.entity);
            }
        }
    },
    async stopAttacking() {
        botStates.attacking = false;
        bot.chat('Okay, I won\'t attack you anymore.');
    },
    async attackEntity() {
        const entity = bot.nearestEntity();
        if (!entity) {
            bot.chat('No nearby entities');
        }
        else {
            bot.chat('Attacking ${entity.name ?? entity.username}');
            bot.attack(entity);
        }
    },
    async eatWithPlayer(daname) {
        this.followMe(daname);
        if (botStates.mentionedEatingWithPlayerAlready = true) {
            console.log('Already mentioned coming to player!');
        }
        else {
            bot.chat('Let me come to you first! :D');
            botStates.mentionedEatingWithPlayerAlready = true;
        }
        if (botStates.looking = true) {
            const eatitem = bot.inventory.items().find(item => item.name === 'Suspicious Stew');
            const eatTime = 1500;
            try {
                await bot.equip(eatitem, 'hand');
                bot.chat("Sorry, I'm still being worked on. I cannot eat yet.");
            }
            catch (err) {
                bot.chat(String(err?.message));
            }
            bot.activateItem();
            await sleep(eatTime);
            bot.deactivateItem();
            botStates.mentionedEatingWithPlayerAlready = false;
        }
        else {
            bot.waitForTicks(200);
            botStates.mentionedEatingWithPlayerAlready = true;
            this.eatWithPlayer(daname);
        }
    },
    async mineAround() {
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
            }
            catch (e) {
                continue;
            }
            await bot.dig(grassBlock, true);
        }
    },
    async followMe(daname) {
        botStates.following = true;
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
        const range = 3;
        while (botStates.following) {
            try {
                if (bot.entity.position.distanceTo(player.entity.position) + 0.15 <= range) {
                    await lookAtEntity(player.entity, true);
                    botStates.looking = true;
                }
                else {
                    botStates.looking = false;
                }
                await sleep(200);
                const goal = new goals.GoalFollow(player.entity, range);
                await bot.pathfinder.goto(goal);
            }
            catch (err) {
                console.log(String(err?.message));
            }
        }
    },
    unFollowMe() {
        if (!botStates.moving) {
            return;
        }
        botStates.moving = false;
        botStates.following = false;
        bot.pathfinder.stop();
    }
};