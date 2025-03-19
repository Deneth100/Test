const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "alive",
    react: "👋",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let totalStorage = Math.floor(os.totalmem() / 1024 / 1024) + 'MB';
        let freeStorage = Math.floor(os.freemem() / 1024 / 1024) + 'MB';
        
        let desc = `👋 Hey ${pushname},

I Aᴍ Aʟɪᴠᴇ Nᴏᴡ 

ɪ ᴀᴍ ᴀɴ ᴀᴜᴛᴏᴍᴀᴛᴇᴅ ꜱʏꜱᴛᴇᴍ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ ᴛʜᴀᴛ ᴄᴀɴ ʜᴇʟᴘ ᴛᴏ ᴅᴏ ꜱᴏᴍᴇᴛʜɪɴɢ, ꜱᴇᴀʀᴄʜ ᴀɴᴅ ɢᴇᴛ ᴅᴀᴛᴀ / ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ ᴏɴʟʏ ᴛʜᴏᴜɢʜ ᴡʜᴀᴛꜱᴀᴘᴘ

> ʙᴏᴛ ɴᴀᴍᴇ : ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠ1
> ᴛᴏᴛᴀʟ ʀᴀᴍ : ${totalStorage}
> ꜰʀᴇᴇ ʀᴀᴍ : ${freeStorage}
> ᴏᴡɴᴇʀ : ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®

🥰 𝗛𝗮𝘃𝗲 𝗮 𝗡𝗶𝗰𝗲 𝗗𝗮𝘆 🥰

> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: `https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true` },
            caption: desc,  // Send the description as the caption
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});

cmd({
    pattern: "restart",
    desc: "restart the bot",
    react: "🔄",
    category: "owner",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
const {exec} = require("child_process")
reply("*DENETH-MD Restarting...*")
await sleep(1500)
exec("pm2 restart all")
}catch(e){
console.log(e)
reply(`${e}`)
}
})

cmd({
    pattern: "ping",
    react: "⚡",
    alias: ["speed"],
    desc: "Check bot's ping",
    category: "main",
    use: '.ping',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        var initial = new Date().getTime(); // Record initial time
        // Send a temporary message to calculate the delay
        let tempMessage = await conn.sendMessage(from, { text: 'Calculating ping...' }, { quoted: mek });
        var final = new Date().getTime(); // Record final time after sending the message
        
        let latency = final - initial; // Calculate latency in milliseconds
        
        // Prepare the final message with calculated ping
        let pong = `*Ping Responce* : *${latency} ms*`;
        let ping = `ＤＥＮＥＴＨ－ＭＤ ＰＩＮＧ ＴＥＳＴ

> ${pong}

⚠ ᴛʜɪꜱ ꜱᴘᴇᴇᴅ ᴠᴀʀɪᴇꜱ ᴀᴄᴄᴏʀᴅɪɴɢ ᴛᴏ ᴛʜᴇ ᴘᴇʀꜰᴏʀᴍᴀɴᴄᴇ ᴏꜰ ᴛʜᴇ ᴘʟᴀᴛꜰᴏʀᴍ ʙᴏᴛ ʀᴜɴ ⚠
                                 

> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®
`;

        // Send the final message with an image
        await conn.sendMessage(from, {
            image: { url: `https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true` },
            caption: ping, // Send the description as the caption
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });
    } catch (e) {
        reply('*Error!*');
        console.error(e);
    }
});

const Jimp = require("jimp");
const axios = require("axios");

cmd({
    pattern: "setpp",
    use: '.setpp <url>',
    desc: "Set profile picture with an image URL.",
    category: "utility",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, reply, sock, q }) => {
    try {
        if (!q) return reply('*Please provide an image URL to set as profile picture 🖼️*');
        
        const { data: imageBuffer } = await axios.get(q, { responseType: "arraybuffer" });
        const jimp = await Jimp.read(imageBuffer);
        const min = jimp.getWidth();
        const max = jimp.getHeight();
        const cropped = jimp.clone().crop(0, 0, min, max);
        const scaledImage = await cropped.scaleToFit(720, 720);
        const finalBuffer = await scaledImage.getBufferAsync(Jimp.MIME_JPEG);

        await sock.query({
            tag: "iq",
            attrs: {
                to: "@whatsapp.net",
                type: "set",
                xmlns: "w:profile:picture",
            },
            content: [
                {
                    tag: "picture",
                    attrs: {
                        type: "image",
                    },
                    content: finalBuffer,
                },
            ],
        });

        reply('*Profile picture updated successfully ✅*');
    } catch (error) {
        console.error(error);
        reply('*Failed to set profile picture ❌*');
    }
});
