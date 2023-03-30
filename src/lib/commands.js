import { lookAtEntity } from './mineflayer-utils.js'
import { sleep } from './sleep.js'
import pathfinderPkg from 'mineflayer-pathfinder'
const { goals } = pathfinderPkg

let ignoreMining = false
let bot
export function setup (_bot) {
    bot = _bot
}

// Add more here when needed
export const botStates = {
    moving: false,
    looking: false
}

export const commands = {
    async sleep () {
        console.log("Sleeping!")
        bot.chat("I'm coming :D")
        let bed = bot.findBlock({matching: block=>bot.isABed(block)});
        if (!bed) {
            console.log("Sorry, I can't find a bed!");
            return
        }
        await bot.sleep(bed)
    },
    async stopMining() {
        bot.chat("Okay")
        let ignoreMining = true
    },
    async mineAround() {
        if (ignoreMining === true) return
        if (ignoreMining === null) {
            let ignoreMining = false
        }
        while (ignoreMining === false) {
            bot.chat("Anything for you! :)")
            let grassBlock = bot.findBlock({
	    		matching: block=>{
	    			if (block.name === harvestName && block.metadata === 7) return true;
	    			return block.name === "grass" || block.name === "tall_grass";
	    		},
	    	});

	    	if (!grassBlock) {
	    		console.log("Couldn't find grass.");
	    		return;
	    	}

	    	await bot.goto(grassBlock.position, 1.5);

	    	await bot.dig(grassBlock);

	    	bot.waitForTicks(1);
		
	    	// Look for an item entity
	    	let itemEntity = bot.nearestEntity((entity)=>{
	    		return entity.name === 'item'
	    	});

	    	if (!itemEntity) return;

	    	await bot.goto(itemEntity.position);
		    await bot.waitForTicks(1)
        }
    },
    async followMe (daname) {
        this.followMe.following = true

        const player = bot.players[daname]
        if (botStates.moving) {
            bot.chat("Sorry, can't run this command more than once!")
        }
        botStates.moving = true

        if (!player?.entity) {
            bot.chat("I can't see you, " + daname)
            return
        }

        bot.chat('Okay ' + daname)

        const range = 4
        while (this.followMe.following) {
            if (bot.entity.position.distanceTo(player.entity.position) + 0.15 <= range) {
                lookAtEntity(player.entity, true)
            }
            await sleep(200)
            const goal = new goals.GoalFollow(player.entity, range)
            try {
                await bot.pathfinder.goto(goal)
            } catch (err) {
                bot.chat(String(err?.message))
            }
        }
    },
    unFollowMe () {
        if (!botStates.moving) {
            return
        }
        botStates.moving = false

        this.followMe.following = false
        bot.pathfinder.stop()
    }
}
