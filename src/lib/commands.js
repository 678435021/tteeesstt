import { lookAtEntity } from './mineflayer-utils.js'

export const commands = {
	async followMe (daname) {
		this.followMe.following = true;

		const player = bot.players[daname]
		if (botStates.moving) {
			bot.chat("Sorry, can't run this command more than once!")
		}
		botStates.moving = true

		if (!player?.entity) {
			bot.chat("I can't see you, " + daname)
			return
		}

		bot.chat("Okay " + daname)

		const range = 4
		while (this.followMe.following) {
			await sleep(50)

			if (bot.entity.position.distanceTo(player.entity.position) + 0.15 <= range) {
				lookAtEntity(player.entity)
				continue;
			}
			const goal = new GoalFollow(player.entity, range)
			try {
				await bot.pathfinder.goto(goal)
			} catch (err) {
				bot.chat(String(err?.message));
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