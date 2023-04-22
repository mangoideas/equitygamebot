const { Telegraf } = require('telegraf')

const bot = new Telegraf('5907380542:AAHHR31xNY2VdezFmbZeSGdTCoUnR64bWJs')

bot.context.db = {
    getScores: () => { return 42 }
  }
  
  bot.on('text', (ctx) => {
    const scores = ctx.db.getScores(ctx.message.from.username)
    return ctx.reply(`${ctx.message.from.username}: ${scores}`)
  })
bot.launch()
