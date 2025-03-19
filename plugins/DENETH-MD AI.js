const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
    pattern: "gemini",
    desc: "Chat with Gemini",
    category: "AI",
    filename: __filename
},
async (conn, mek, m, { q, reply, sendImage }) => {
    try {
        if (!q) return reply("Please provide a query!");
        let data = await fetchJson(`https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(q)}`);
        
        if (data.success) {
            let imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true"; // Replace with a relevant image URL
            await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: `${data.result}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`, contextInfo: { forwardingScore: 999, isForwarded: true } }, { quoted: m });
        } else {
            reply("Error: Unable to fetch response from API");
        }
    } catch (e) {
        console.log(e);
        reply("An error occurred while fetching the response.");
    }
});

cmd({
    pattern: "gpt4",
    desc: "Chat with GPT4",
    category: "AI",
    filename: __filename
},
async (conn, mek, m, { q, reply, sendImage }) => {
    try {
        if (!q) return reply("Please provide a query!");
        let data = await fetchJson(`https://api.giftedtech.my.id/api/ai/gpt4?apikey=gifted&q=${encodeURIComponent(q)}`);
        
        if (data.success) {
            let imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true"; // Replace with a relevant image URL
            await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: `${data.result}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`, contextInfo: { forwardingScore: 999, isForwarded: true } }, { quoted: m });
        } else {
            reply("Error: Unable to fetch response from API");
        }
    } catch (e) {
        console.log(e);
        reply("An error occurred while fetching the response.");
    }
});


cmd({
    pattern: "genimg",
    desc: "Generate an image from a prompt",
    category: "AI",
    filename: __filename
},
async (conn, mek, m, { q, reply, sendImage }) => {
    try {
        if (!q) return reply("Please provide a prompt for image generation!");
        let imageUrl = `https://api.giftedtech.my.id/api/ai/text2img?apikey=gifted&prompt=${encodeURIComponent(q)}`;
        
        await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: "Here is your generated image.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®", contextInfo: { forwardingScore: 999, isForwarded: true } }, { quoted: m });
    } catch (e) {
        console.log(e);
        reply("An error occurred while generating the image.");
    }
});

cmd({
    pattern: "genimg2",
    desc: "Generate an image from a prompt",
    category: "AI",
    filename: __filename
},
async (conn, mek, m, { q, reply, sendImage }) => {
    try {
        if (!q) return reply("Please provide a prompt for image generation!");
        let imageUrl = `https://api.giftedtech.my.id/api/ai/sd?apikey=gifted&prompt=${encodeURIComponent(q)}`;
        
        await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: "Here is your generated image.\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®", contextInfo: { forwardingScore: 999, isForwarded: true } }, { quoted: m });
    } catch (e) {
        console.log(e);
        reply("An error occurred while generating the image.");
    }
});
