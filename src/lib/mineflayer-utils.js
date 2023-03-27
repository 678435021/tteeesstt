let bot
export function setup (_bot) {
    bot = _bot
}

export async function lookAtEntity (entity, force = false) {
    await bot.lookAt(entity.position.offset(0, entity.height, 0), force)
}
