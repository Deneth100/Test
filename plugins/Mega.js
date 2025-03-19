const config = require('../config')
const fetch = require('node-fetch')
const { sizeFormatter} = require('human-readable');;
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

// Google Drive Downloader
const formatSize = sizeFormatter({
  std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B`});

async function GDriveDl(url) {
  let id, res = {
    error: !0
  };
  if (!url || !url.match(/drive\.google/i)) return res;
  try {
    if (id = (url.match(/\/?id=(.+)/i) || url.match(/\/d\/(.*?)\//))[1], !id) throw "ID Not Found";
    res = await fetch(`https://drive.google.com/uc?id=${id}&authuser=0&export=download`, {
      method: "post",
      headers: {
        "accept-encoding": "gzip, deflate, br",
        "content-length": 0,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        origin: "https://drive.google.com",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        "x-client-data": "CKG1yQEIkbbJAQiitskBCMS2yQEIqZ3KAQioo8oBGLeYygE=",
        "x-drive-first-party": "DriveWebUi",
        "x-json-requested": "true"
      }
    });
    let {
      fileName,
      sizeBytes,
      downloadUrl
    } = JSON.parse((await res.text()).slice(4));
    if (!downloadUrl) throw "Link Download Limit!";
    let data = await fetch(downloadUrl);
    return 200 !== data.status ? data.statusText : {
      downloadUrl: downloadUrl,
      fileName: fileName,
      fileSize: formatSize(sizeBytes),
      mimetype: data.headers.get("content-type")
    };
  } catch (e) {
    return console.log(e), res;
  }
}


cmd({
    pattern: "gdrive",
    alias: ["googledrive'"],
    react: '📁',
    desc: "Download googledrive files.",
    category: "download",
    use: '.gdrive <googledrive link>',
    filename: __filename
},
async(conn, mek, m,{from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  if (!q) return await  reply('*Please give me googledrive url !!*')   
let res = await GDriveDl(q)
reply(`📁 ꜰɪʟᴇ ɴᴀᴍᴇ :  ${res.fileName}
💣 ꜰɪʟᴇ ꜱɪᴢᴇ : ${res.fileSize}
🪀 ꜰɪʟᴇ ᴛʏᴘᴇ : ${res.mimetype}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`)		
conn.sendMessage(from, { document: { url: res.downloadUrl }, fileName: res.fileName, mimetype: res.mimetype }, { quoted: mek })
} catch (e) {
reply('*Error !!*')
console.log(e)
//reply(${e})
}
})

// Mega Downloader
const axios = require('axios');
const { File } = require('megajs');

cmd({
    pattern: "mega",
    react: "📁",
    alias: ["megadl","meganz"],
    desc: "urlneed",
    category: "download",
    use: '.mega url',
    filename: __filename
}, 
    async (conn, mek, m, { from, q, reply }) => {
    if (!q) {
        return await reply('*Please provide a mega.nz URL!*');
    }

    try {
        const file = File.fromURL(q)
        await file.loadAttributes()
        //if (file.size >= 2048 * 1024 * 1024) return reply(`File size exeeded...\nMaximum Upload Size Is ${config.MAX_SIZ} MB`)
        const data = await file.downloadBuffer();
        
        if (/mp4/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "video/mp4", filename: `📁ᴅᴇɴᴇᴛʜ-ᴍᴅ📁${file.name}` }, { quoted: mek });
        } else if (/pdf/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "application/pdf", filename: `📁ᴅᴇɴᴇᴛʜ-ᴍᴅ📁${file.name}` }, { quoted: mek });
        } else if (/zip/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "application/zip", filename: `📁ᴅᴇɴᴇᴛʜ-ᴍᴅ📁${file.name}` }, { quoted: mek });
        } else if (/rar/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "application/x-rar-compressed", filename: `📁ᴅᴇɴᴇᴛʜ-ᴍᴅ📁${file.name}` }, { quoted: mek });
        } else if (/7z/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "application/x-7z-compressed", filename: `📁ᴅᴇɴᴇᴛʜ-ᴍᴅ📁${file.name}` }, { quoted: mek });
        } else if (/jpg|jpeg/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "image/jpeg", filename: `📁ᴅᴇɴᴇᴛʜ-ᴍᴅ📁${file.name}` }, { quoted: mek });
        } else if (/png/.test(file.name)) {
            await conn.sendMessage(from, { document: data, mimetype: "image/png", filename: `📁ᴅᴇɴᴇᴛʜ-ᴍᴅ📁${file.name}` }, { quoted: mek });
        } else {
            await conn.sendMessage(from, { document: data, mimetype: "application/octet-stream", filename: `📁ᴅᴇɴᴇᴛʜ-ᴍᴅ📁${file.name}` }, { quoted: mek })
        }
        
        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
});

// Tiktok Downloader
// FETCH API URL
let baseUrl;
(async () => {
    let baseUrlGet = await fetchJson(`https://raw.githubusercontent.com/prabathLK/PUBLIC-URL-HOST-DB/main/public/url.json`)
    baseUrl = baseUrlGet.api
})();

// TikTok
let needus = "*Please give me a TikTok URL!*";

// Function to fetch download options for TikTok videos
async function dlPanda(url) {
  try {
    const response = await fetch(`https://dlpanda.com/id?url=${url}&token=G7eRpMaa`);
    const html = await response.text();
    const $ = cheerio.load(html);
    const results = { image: [], video: [] };

    $("div.hero.col-md-12.col-lg-12.pl-0.pr-0 img, div.hero.col-md-12.col-lg-12.pl-0.pr-0 video").each(function () {
      const element = $(this);
      const isVideo = element.is("video");
      const src = isVideo ? element.find("source").attr("src") : element.attr("src");
      const fullSrc = src.startsWith("//") ? "https:" + src : src;
      results[isVideo ? "video" : "image"].push({ src: fullSrc });
    });
    return results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Command to display TikTok download options with a numbered menu
const cheerio = require('cheerio');

cmd({
  pattern: "tt",
  alias: ["tiktok"],
  react: '🎦',
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return await reply(needus);

    const res = await fetchJson('https://api.tiklydown.eu.org/api/download?url=' + q);
    if (!res || !res.video) return reply("Unable to fetch download options.");

    const msg = `𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 𝗧𝗜𝗞𝗧𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥\n🎦 Tɪᴛʟᴇ: ${res.title}\n📅 Dᴀᴛᴇ: ${res.created_at}\n⏰ ᴅᴜʀᴀᴛɪᴏɴ: ${res.video.duration}`;
    const wm = `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;

    // Construct numbered options menu
    let message = `${msg}\n\nREPLY THE DOWNLOAD OPTION\n\n`;
    message += `𝟭 | 𝗪𝗜𝗧𝗛𝗢𝗨𝗧 𝗪𝗔𝗧𝗘𝗥𝗠𝗔𝗥𝗞\n`;
    message += `𝟮 | 𝗪𝗜𝗧𝗛 𝗪𝗔𝗧𝗘𝗥𝗠𝗔𝗥𝗞\n`;
    message += `𝟯 | 𝗔𝗨𝗗𝗜𝗢\n\n${wm}`;

    // Send message with menu
    const sentMessage = await conn.sendMessage(from, {
            image: {url: `https://github.com/Deneth400/DENETH-MD-HARD/blob/main/Images/Tiktok.jpg?raw=true`},
            caption: message,  // Send the description as the caption
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
            }
        }, { quoted: mek });
    // Listen for the user's reply
    conn.ev.on("messages.upsert", async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;
      if (message.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) return;

      const userChoice = message.message.extendedTextMessage.text.trim();
      let url;
      
      switch (userChoice) {
        case '1':
          url = res.video.noWatermark;
          break;
        case '2':
          url = res.video.watermark;
          break;
        case '3':
          url = res.music.play_url;
          break;
        default:
          return reply("Invalid choice. Please reply with a valid number.");
      }

      const downloadMessage = `*Downloading:* ${res.title}\nPlease wait...`;
      await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

      // Send media based on selection
      if (userChoice === '3') {
        await conn.sendMessage(from, { audio: { url }, mimetype: 'audio/mpeg' }, { quoted: mek });
      } else {
        await conn.sendMessage(from, { video: { url }, caption: wm }, { quoted: mek });
      }
    });
  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { text: '*Error!*' }, { quoted: mek });
  }
});
