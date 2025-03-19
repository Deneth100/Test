const config = require('../config')
const { igdl } = require('ruhend-scraper')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

let session = {};

async function fetchFBVideo(url) {
    try {
        const response = await fetchJson(`https://deneth-dev-api-links.vercel.app/api/fb1?url=${encodeURIComponent(url)}&api_key=deneth2009`);
        return response.result || null;
    } catch (error) {
        console.error('Error fetching Facebook video:', error);
        return null;
    }
}

cmd({
    pattern: "fb",
    alias: ["fbvideo"],
    use: '.fb <url>',
    react: "⬇",
    desc: "Download Facebook videos.",
    category: "downloader",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('⭕ *Please Provide A Facebook Video URL.*');
        
        let videoData = await fetchFBVideo(q);
        if (!videoData) return reply("❌ *Error Fetching Video Data!* 🙄");
        
        let message = `▶ *DENETH-MD FB VIDEO DOWNLOADER* ▶\n\n` +
                      `⭕ *Title:* ${videoData.title || 'No Title'}\n` +
                      `✍ *Description:* ${videoData.desc || 'No Description'}\n\n` +
                      `⬇ *DOWNLOAD OPTIONS*\n` +
                      `1 || SD QUALITY\n` +
                      `2 || HD QUALITY\n\n` +
                      `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
        
        const sentMessage = await messageHandler.sendMessage(from, {
            image: { url: videoData.thumb },
            caption: message
        }, { quoted: quotedMessage });

        session[from] = { videoData, messageId: sentMessage.key.id };

        const handleUserReply = async (update) => {
            const userMessage = update.messages[0];
            if (!userMessage.message.extendedTextMessage ||
                userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
                return;
            }

            const userReply = userMessage.message.extendedTextMessage.text.trim();
            let downloadUrl = userReply === '1' ? videoData.sd : userReply === '2' ? videoData.hd : null;

            if (!downloadUrl) return reply("⭕ *Please Enter A Valid Number (1 or 2).* ");

            await messageHandler.sendMessage(from, { react: { text: "⬇", key: userMessage.key } });
            
            await messageHandler.sendMessage(from, {
                video: { url: downloadUrl },
                mimetype: 'video/mp4',
                fileName: `🎥 ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠɪᴅᴇᴏꜱ 🎥 ${videoData.title || 'FaceBook'} | ${userReply === '1' ? 'SD' : 'HD'}.mp4`,
                caption: `▶ *${videoData.title || 'FaceBook Video'} (${userReply === '1' ? 'SD' : 'HD'} Quality)* ▶\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`
            }, { quoted: quotedMessage });
            
            await messageHandler.sendMessage(from, { react: { text: "✅", key: userMessage.key } });
        };

        messageHandler.ev.on("messages.upsert", handleUserReply);
    } catch (error) {
        console.error(error);
        await messageHandler.sendMessage(from, { text: '❌ *Error Occurred During The Process!*' }, { quoted: quotedMessage });
    }
});

// Twitter
async function fetchTwitterVideo(url) {
    try {
        const response = await fetchJson(`https://deneth-dev-api-links.vercel.app/api/twitter?link=${encodeURIComponent(url)}&api_key=deneth2009`);
        return response.result || null;
    } catch (error) {
        console.error('Error fetching Twitter video:', error);
        return null;
    }
}

cmd({
    pattern: "twitter",
    alias: ["twvideo"],
    use: '.twitter <url>',
    react: "⬇",
    desc: "Download Twitter videos.",
    category: "downloader",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('⭕ *Please Provide A Twitter Video URL.*');
        
        let videoData = await fetchTwitterVideo(q);
        if (!videoData) return reply("❌ *Error Fetching Video Data!* 🙄");
        
        let message = `▶ *DENETH-MD X VIDEO DOWNLOADER* ▶\n\n` +
                      `⭕ *Description:* ${videoData.desc || 'No Description'}\n\n` +
                      `⬇ *DOWNLOAD OPTIONS*\n` +
                      `1 || SD QUALITY\n` +
                      `2 || HD QUALITY\n` +
                      `3 || AUDIO\n\n` +
                      `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
        
        const sentMessage = await messageHandler.sendMessage(from, {
            image: { url: videoData.thumb },
            caption: message
        }, { quoted: quotedMessage });

        session[from] = { videoData, messageId: sentMessage.key.id };

        const handleUserReply = async (update) => {
            const userMessage = update.messages[0];
            if (!userMessage.message.extendedTextMessage ||
                userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
                return;
            }

            const userReply = userMessage.message.extendedTextMessage.text.trim();
            let downloadUrl = null;
            let mimeType = 'video/mp4';
            let fileExtension = '.mp4';

            if (userReply === '1') {
                downloadUrl = videoData.video_sd;
            } else if (userReply === '2') {
                downloadUrl = videoData.video_hd;
            } else if (userReply === '3') {
                downloadUrl = videoData.audio;
                mimeType = 'audio/mp4';  // Set correct mime type for audio
                fileExtension = '.mp3';  // Set the correct file extension for audio
            } else {
                return reply("⭕ *Please Enter A Valid Number (1, 2, or 3).*");
            }

            if (!downloadUrl) return reply("❌ *Error Fetching Download URL!*");

            await messageHandler.sendMessage(from, { react: { text: "⬇", key: userMessage.key } });

            await messageHandler.sendMessage(from, {
                [mimeType.startsWith('audio') ? 'audio' : 'video']: { url: downloadUrl },
                mimetype: mimeType,
                fileName: `🎥 ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴠɪᴅᴇᴏꜱ 🎥 ${videoData.desc || 'Twitter Video'} | ${userReply === '1' ? 'SD' : userReply === '2' ? 'HD' : 'Audio'}${fileExtension}`,
                caption: `▶ *${videoData.desc || 'Twitter Video'} (${userReply === '1' ? 'SD' : userReply === '2' ? 'HD' : 'Audio'} Quality)* ▶\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`
            }, { quoted: quotedMessage });
            
            await messageHandler.sendMessage(from, { react: { text: "✅", key: userMessage.key } });
        };

        messageHandler.ev.on("messages.upsert", handleUserReply);
    } catch (error) {
        console.error(error);
        await messageHandler.sendMessage(from, { text: '❌ *Error Occurred During The Process!*' }, { quoted: quotedMessage });
    }
});

// Instagram
var needus = "🚩*Please give me instagram url !!*" 
var cantf = "🚩 *I cant find this video!*" 
cmd({
    pattern: "ig",
    alias: ["insta"],
    react: '💫',
    desc: "Download Instagram videos",
    category: "download",
    use: '.ig <insta link>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
if (!q) return await  reply(needus)
let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`
let res = await igdl(q)
let data = await res.data;
//let data = await res.data
for (let media of res.data) {
await conn.sendMessage(from, { video: { url: media.url }, caption: wm}, { quoted: mek })
//conn.sendFileUrl(from, media.url, wm, mek )
}
} catch (e) {
let wm = `© 𝖰𝗎𝖾𝖾𝗇 𝗄𝖾𝗇𝗓𝗂 𝗆𝖽 v${require("../package.json").version} (Test)\nsɪᴍᴘʟᴇ ᴡᴀʙᴏᴛ ᴍᴀᴅᴇ ʙʏ ᴅᴀɴᴜxᴢᴢ 🅥`
let res = await igdl(q)
//let data = await res.data
for (let media of res.data) {
await conn.sendMessage(from, { image: { url: media.url }, caption: wm}, { quoted: mek })
//conn.sendFileUrl(from, media.url, wm, mek )
}
console.log(e)
} 
}
)

