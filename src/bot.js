// Here I tell node.js mineflayer and a few other plugins are required to load
import { createBot } from 'mineflayer'
import pathfinderPkg from 'mineflayer-pathfinder'
import { commands, setup as setupCmds } from './lib/commands.js'
import { setup as setupMfUtils } from './lib/mineflayer-utils.js'
const { pathfinder, Movements } = pathfinderPkg

// Here, we set up the server connection (in this case, my skin plugin server)
export const bot = createBot({
    host: 'SonicJavaBots.aternos.me',
    port: '37867',
    username: 'aaaa',
    version: '1.18.2'
})

setupMfUtils(bot)
setupCmds(bot)

const mcData = (await import('minecraft-data')).default(bot.version)

// Setup pathfinder
bot.loadPlugin(pathfinder)
bot.pathfinder.setMovements(new Movements(bot, mcData))

// And now, we work on the AI here!
// Here's all of the functions:
// One note tho: All functions are placeholders.
function onPhysicsTick () {}

function onSpawn () {
    bot.chat("Hey! I'm working properly :D")
    bot.chat('/skin set SonicandTailsCDb robot1_stevetest')

    bot.on('chat', (daname, msg) => {
        if (msg === 'follow me') {
            commands.followMe(daname)
            return
        }

        if (msg === 'stop following me') {
            commands.unFollowMe()
        }
    })
}

// I need to set physicsTick because I want the AI to target me.
bot.on('physicsTick', onPhysicsTick)

// Next, I'm gonna set spawn actions.
bot.once('spawn', onSpawn)
