require('dotenv').config();
const { botRespuesta } = require('./bot');

const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.on('message', async(ctx) => {
    // ctx.reply('text message');
    // console.log('mensaje enviado1');
    // console.log(ctx.message.text);
    let respuesta = await botRespuesta(ctx.message.text);
    // console.log('respuesta', respuesta);
    ctx.reply(respuesta);
});
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));