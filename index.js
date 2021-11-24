const TelegramApi = require('node-telegram-bot-api')
const fs = require('fs')
const token = fs.readFileSync('token.txt')
const bot = new TelegramApi(token, {polling: true})
const chats = {}
const {gameOptions, againOptions} = require('./options')
const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадал число от 0 до 9, а ты постарайся отгадать`);
    chats[chatId] = Math.floor(Math.random() * 10);
    await bot.sendMessage(chatId, `Отгадывай!`, gameOptions);
}
const getNews = async (chatId) => {

}
const start = () => {
    bot.setMyCommands([
        {command: '/info', description: 'Информация о боте'},
        {command: '/game', description: 'Угадай число'},
        {command: '/news', description: 'Новость из NewsAPI'}
    ])

    bot.on('message', async msg  => {
        const text = msg.text;
        const chatId = msg.chat.id;
        const firstName = msg.from.first_name;

        if (text === '/info') {
            return bot.sendMessage(chatId, `Бот еще разрабатывается, спасибо за участие в тестировании, ${firstName}!`)
        }
        if (text === '/game') {
            return startGame(chatId)
        }
        if (text === '/news') {
            return getNews()
        }
        return bot.sendMessage(chatId, `Я тебя не понял, но в будущем буду пересылать на админа`);

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId].toString()) {
            return await bot.sendMessage(chatId, `Ты отгадал число ${chats[chatId]}`, againOptions)
        } else {
            return await bot.sendMessage(chatId, `Не угадал, это было число ${chats[chatId]}`, againOptions)
        }

    })
}

start()