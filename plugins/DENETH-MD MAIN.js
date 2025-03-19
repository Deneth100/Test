const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os");
const { runtime } = require('../lib/functions');

//=============== MENU =====================
cmd({
    pattern: "menu",
    alias: ["list"],
    desc: "menu the bot",
    react: "📜",
    category: "main"
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // Main menu message
        const desc = `👋 𝐻𝑒𝓁𝓁𝑜 *${pushname}*

*╭──═❯ ꜱʏꜱᴛᴇᴍ ɪɴꜰᴏ ❮═──❖*
*│ ʀᴜɴᴛɪᴍᴇ : ${runtime(process.uptime())}*
*│ ʀᴀᴍ ᴜꜱᴀɢᴇ : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB*
*│ ᴘʟᴀᴛꜰᴏʀᴍ : ${os.hostname()}*
*│ ᴠᴇʀꜱɪᴏɴ : 1.0.0*
*╰─────────────❖*

*---ＭＡＩＮ ＭＥＮＵ ＬＩＳＴ---*
 
*1   || OWNER*
*2   || CONVERT*
*3   || AI*
*4   || NEWS*
*5   || DOWNLOAD*
*6   || MAIN*
*7   || GROUP*
*8   || FUN*
*9   || TOOLS*
*10 || OTHER*

> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;

// Send the menu message with the image
const menuMessage = await conn.sendMessage(from, { 
 image: { 
    url: "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true" 
        }, 
         caption: desc ,
        contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: mek });

        // Listen for replies to the menu message
        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();
            if (msg.message.extendedTextMessage.contextInfo?.stanzaId === menuMessage.key.id) {
                let response = '';
                let imageUrl = "";

// Handle user selection
switch (selectedOption) {
  case '1':
response = `*ＯＷＮＥＲ ＣＯＭＭＡＮＤ ＬＩＳＴ*
                        
 ───────────────
*1.RESTART THE BOT*
> Type <.restart>
*2.BLOCK USER*
> Type <.block>
*3.UNBLOCK USER*
> Type <.unblock>
*4.BROADCAST MSG YOUR GROUPS*
> Type <.broadcast 'message'>
 ───────────────
                        
🔢 Total Commands List Owner: 4
                      
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true";
    break;
case '2':
    response = `*◈╾──────CONVERT COMMAND LIST──────╼◈*
                        
╭────────●●►
│ • *convert* 
╰────────────────────●●►
                        
⭓ *Total Commands List CONVERT: 1*
                        
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`;
imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true";
    break;
case '3':
    response = `*ＡＩ ＣＯＭＭＡＮＤ ＬＩＳＴ*
                        
 ───────────────
*1.CHAT WITH CHATGPT*
> Type <.gpt 'promt'>
*2.CHAT WITH BLACKBOX*
> Type <.blackbox 'promt'>
*3.GENERATE IMG WITH BING*
> Type <.bingimg 'promt'>
*4.CHAT WITH LLAMA*
> Type <.llama 'promt'>
 ───────────────
                        
🔢 Total Commands List AI: 4
                        
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true";
    break;
case '4':
    response = `*ＮＥＷＳ ＣＯＭＭＡＮＤ ＬＩＳＴ*
                        
 ───────────────
*1.GET LATEST HIRU NEWS*
> Type <.hirunews>
*2.GET LATEST SIRASA NEWS*
> Type <.sirasanews>
*3.GET LATEST DERANA NEWS*
> Type <.derananews'>
*4.GET LATEST BBC NEWS*
> Type <.bbc>
*5.GET LATEST LANKADEEPA NEWS*
> Type <.lankadeepa>
*6.GET LATEST NETH NEWS*
> Type <.nethnews>
*7.GET LATEST DASATHALANKA NEWS*
> Type <.dasathalanka>
*8.GET LATEST ITN NEWS*
> Type <.itn>
*9.GET LATEST SIYATHA NEWS*
> Type <.siyatha>
*10.GET LATEST LNW NEWS*
> Type <.lnw>
*11.GET LATEST GOSSIPLANKA NEWS*
> Type <.gossiplanka>
 ───────────────
                        
🔢 Total Commands List News: 4
                        
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true";
    break;
case '5':
    response = `*ＤＯＷＮＬＯＡＤ ＣＯＭＭＡＮＤ ＬＩＳＴ*
                        
 ───────────────
*1.DOWNLOAD FB VIDEOS*
> Type <.fb 'url'>
*2.DOWNLOAD INSTA VIDEOS*
> Type <.insta 'url'>
*3.DOWNLOAD TWITTER VIDEOS*
> Type <.twitter 'url'>
*4.DOWNLOAD YOUTUBE SONGS*
> Type <.song 'query'>
*5.DOWNLOAD YOUTUBE VIDEOS*
> Type <.video 'query'>
*6.DOWNLOAD TIKTOK VIDEOS*
> Type <.tiktok 'url'>
 ───────────────
                        
🔢 Total Commands List Download: 6
                        
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true";
     break;
case '6':
     response = `*ＭＡＩＮ ＣＯＭＭＡＮＤ ＬＩＳＴ*

 ───────────────
*1.CHECK BOT ONLINE*
> Type <.alive>
*2.GET BOT MENU*
> Type <.menu>
*3.CHECK BOT PING*
> Type <.ping>
*4.CHECK BOT SYSTEM UPTIME*
> Type <.system'>
*5.GET BOT FULL MENU*
> Type <.allmenu'>
*6.CHECK BOT RUNTIME*
> Type <.runtime'>
*7.GET BOT ABOUT*
> Type <.about'>
 ───────────────
                        
🔢 Total Commands List Main: 7
                        
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true";
                        break;
case '7':
     response = `*ＧＲＯＵＰ ＣＯＭＭＡＮＤ ＬＩＳＴ*

 ───────────────
*1.CHECK BOT ONLINE*
> Type <.alive>
*2.GET BOT MENU*
> Type <.menu>
*3.CHECK BOT PING*
> Type <.ping>
*4.CHECK BOT SYSTEM UPTIME*
> Type <.system'>
*5.GET BOT FULL MENU*
> Type <.allmenu'>
*6.CHECK BOT RUNTIME*
> Type <.runtime'>
*7.GET BOT ABOUT*
> Type <.about'>
 ───────────────
                        
🔢 Total Commands List Main: 7
                        
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true";
                        break;
case '8':
     response = `*ＦＵＮ ＣＯＭＭＡＮＤ ＬＩＳＴ*

 ───────────────
*1.PRANK HACK*
> Type <.hack>
*2.GET RANDOM JOKES*
> Type <.joke>
*3.GET DOG IMAGES*
> Type <.dog>
*4.CHECK BOT SYSTEM UPTIME*
> Type <.system'>
*5.GET FACTS*
> Type <.fact'>
 ───────────────
                        
🔢 Total Commands List Main: 5
                        
> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;
imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true";
                        break;
                    default:
                        response = "Invalid option. Please select a valid option 🔴.";
                        break;
                }

                // Send the selected response
                await conn.sendMessage(from, { 
                    image: { url: imageUrl}, 
                    caption: response 
                }, { quoted: msg });
            }
        });
    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('An error occurred while processing your request.');
    }
});
