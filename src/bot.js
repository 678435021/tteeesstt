// Here I tell node.js mineflayer and a few other plugins are required to load
import { versions } from 'minecraft-data'
import { createBot } from 'mineflayer'
import { pathfinder, Movements, goals } from 'mineflayer-pathfinder'
const GoalFollow = goals.GoalFollow
import { plugin as pvp } from 'mineflayer-pvp'

// Here, we set up the server connection (in this case, my skin plugin server)
export const bot = createBot({
    host: 'SonicJavaBots.aternos.me',
    port: '37867',
    username: "aaaa",
    version: '1.18.2'
})

const mcData = require('minecraft-data')(bot.version)

// Add more here when needed
export const botStates = {
    moving: false,
	looking: false
}

// Setup pathfinder
bot.loadPlugin(pathfinder)
bot.pathfinder.setMovements( new Movements(bot, mcData))

// And now, we work on the AI here!
// Here's all of the functions:
// One note tho: All functions are placeholders.
function onPhysicsTick () {}

function onSpawn () {
    bot.chat("Hey! I'm working properly :D")
    bot.chat("/skin set SonicandTailsCDb robot1_stevetest")

    bot.on('chat', (daname, msg)=>{
        if (msg === "follow me") {
			void commands.followMe(daname)
			return
        }

		if (msg === "stop following me") {
			commands.unFollowMe()
			return
		}
    })
}

// I need to set physicsTick because I want the AI to target me.
bot.on('physicsTick', onPhysicsTick)

// Next, I'm gonna set spawn actions.
bot.once('spawn', onSpawn)
