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
    username: 'SonicandTailsCDb',
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
    bot.chat('/skin set SonicandTailsCDb robot1_alextest')
    bot.chat("Hey! I'm working properly :D")
    bot.on('chat', (daname, msg) => {
        if (daname === "SonicandTailsCDb") return
        if (daname === "SkinsRestorer") return
        console.log(daname + " said: " + msg)
        if (msg === 'follow me') {
            commands.followMe(daname)
            console.log("I started following " + daname)
            return
        }
        if (msg === 'Come here, sleep with me!') {
            commands.sleep()
        }
        if (msg === 'Clean the area') {
            commands.mineAround()
        }
        if (msg === 'Stop cleaning') {
            commands.stopMining()
        }
        if (msg === 'hey') {
            bot.chat("what you want?")
            console.log("I said: what you want?")
        }
        if (msg === 'Apply my custom skin') {
            bot.chat("Alright.")
            bot.chat("/skin set SonicandTailsCD sonicskin")
            console.log("Applied custom skin for Sonic :)")
        }
        if (msg === 'stop following me') {
            commands.unFollowMe()
            console.log("I stopped following " + daname)
        }
    })
}

// I'm unsure on how am I gonna use onPhysicsTick function but I'll leave it there in case me or @678435021 wanna use it.
bot.on('physicsTick', onPhysicsTick)

// Next, I'm gonna set spawn actions.
bot.once('spawn', onSpawn)
