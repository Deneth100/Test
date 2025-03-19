const yts = require('yt-search');
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
let wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`
let res = await igdl(q)
let data = await res.data;
//let data = await res.data
for (let media of res.data) {
await conn.sendMessage(from, { video: { url: media.url }, caption: wm}, { quoted: mek })
//conn.sendFileUrl(from, media.url, wm, mek )
}
} catch (e) {
let wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`
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

cmd({
  pattern: "song",
  desc: "Download songs.",
  category: "download",
  react: '🎧',
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, reply, q }) => {
  try {
    if (!q) return reply("Please provide a song name or URL!");
    
    const searchResults = await yts(q);
    if (!searchResults || searchResults.videos.length === 0) {
      return reply("No song found matching your query.");
    }

    const songData = searchResults.videos[0];
    const apiURL = `https://manul-ofc-tech-api-1e5585f5ebef.herokuapp.com/ytmp3?url=${songData.url}`;
    const downloadLinkResult = await fetchJson(apiURL);

    if (!downloadLinkResult || !downloadLinkResult.dl) {
      return reply("Failed to fetch download link for the song.");
    }

    const downloadLink = downloadLinkResult.dl;
    let songDetailsMessage = `*🎶 DENETH-MD AUDIO DOWNLOADER 🎶*

`;
    songDetailsMessage += `*⚜ Title:* ${songData.title}\n`;
    songDetailsMessage += `*👀 Views:* ${songData.views}\n`;
    songDetailsMessage += `*⏰ Duration:* ${songData.timestamp}\n`;
    songDetailsMessage += `*📆 Uploaded:* ${songData.ago}\n`;
    songDetailsMessage += `*📽 Channel:* ${songData.author.name}\n`;
    songDetailsMessage += `*🖇 URL:* ${songData.url}\n\n`;
    songDetailsMessage += `*Choose Your Download Format:*\n\n`;
    songDetailsMessage += `1️⃣ - Audio File 🎶\n`;
    songDetailsMessage += `2️⃣ - Document File 📂\n\n`;
    songDetailsMessage += `> Powered by Deneth-XD Tech®`;

    const sentMessage = await messageHandler.sendMessage(from, {
      image: { url: songData.thumbnail },
      caption: songDetailsMessage,
    }, { quoted: quotedMessage });

    messageHandler.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;
      const userReply = message.message.extendedTextMessage.text.trim();

      if (message.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
        switch (userReply) {
          case '1':
            await messageHandler.sendMessage(from, {
              audio: { url: downloadLink },
              mimetype: "audio/mpeg"
            }, { quoted: quotedMessage });
            break;
          case '2':
            await messageHandler.sendMessage(from, {
              document: { url: downloadLink },
              mimetype: 'audio/mpeg',
              fileName: `${songData.title}.mp3`,
              caption: `${songData.title}\n\n> Powered by Deneth-XD Tech®`
            }, { quoted: quotedMessage });
            break;
          default:
            reply("Invalid option. Please select a valid option. ❌");
            break;
        }
      }
    });
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing your request. ❌");
  }
});

cmd({
  pattern: "video",
  desc: "Download videos.",
  category: "download",
  react: '📹',
  filename: __filename
}, async (messageHandler, context, quotedMessage, { from, reply, q }) => {
  try {
    if (!q) return reply("Please provide a video name or URL!");

    const searchResults = await yts(q);
    if (!searchResults || searchResults.videos.length === 0) {
      return reply("No video found matching your query.");
    }

    const videoData = searchResults.videos[0];
    const apiURL = `https://manul-ofc-tech-api-1e5585f5ebef.herokuapp.com/ytmp4?url=${videoData.url}`;
    const downloadLinkResult = await fetchJson(apiURL);

    if (!downloadLinkResult || !downloadLinkResult.dl) {
      return reply("Failed to fetch download link for the video.");
    }

    const downloadLink = downloadLinkResult.dl;
    let videoDetailsMessage = `*🎥 VIDEO DOWNLOADER 🎥*\n\n`;
    videoDetailsMessage += `*⚜ Title:* ${videoData.title}\n`;
    videoDetailsMessage += `*👀 Views:* ${videoData.views}\n`;
    videoDetailsMessage += `*⏰ Duration:* ${videoData.timestamp}\n`;
    videoDetailsMessage += `*📆 Uploaded:* ${videoData.ago}\n`;
    videoDetailsMessage += `*📽 Channel:* ${videoData.author.name}\n`;
    videoDetailsMessage += `*🖇 URL:* ${videoData.url}\n\n`;
    videoDetailsMessage += `> Powered by Deneth-XD Tech®`;

    await messageHandler.sendMessage(from, {
      image: { url: videoData.thumbnail },
      caption: videoDetailsMessage,
    }, { quoted: quotedMessage });

    await messageHandler.sendMessage(from, {
      video: { url: downloadLink },
      mimetype: "video/mp4",
      caption: `${videoData.title}\n\n> Powered by Deneth-XD Tech®`
    }, { quoted: quotedMessage });

  } catch (error) {
    console.error(error);
    reply("An error occurred while processing your request. ❌");
  }
});

