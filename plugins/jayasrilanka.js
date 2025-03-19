const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

let session = {};

async function searchJayasrilanka(query) {
    try {
        const response = await fetchJson(`https://api-vishwa.vercel.app/download-jayasrilnaka-search?qry=${query}`);
        return response.status ? response.data : [];
    } catch (error) {
        console.error('Error fetching Jayasrilanka search results:', error);
        return [];
    }
}

async function getSongDownloadLink(link) {
    try {
        const response = await fetchJson(`https://api-vishwa.vercel.app/download-jayasrilnaka-songdl?link=${link}&apikey=`);
        return response.status ? response.data.audioLink : null;
    } catch (error) {
        console.error('Error fetching song download link:', error);
        return null;
    }
}

cmd({
    pattern: "jayasrilk",
    alias: ["jayasrilanka"],
    use: '.jayasrilk <query>',
    react: "🎵",
    desc: "Search and download songs from Jayasrilanka.",
    category: "music",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('⭕ *Please Provide A Song Name.*');

        let songs = await searchJayasrilanka(q);
        if (songs.length < 1) return reply("⭕ *No Songs Found!* 🙄");

        let message = `🎵 *DENETH-MD JAYASRILANKA* 🎵\n\n`;
        songs.forEach((song, index) => {
            let songTitle = song.title.replace(/^\d+\.\s*/, "");
            message += `${index + 1}. ${songTitle}\n`;
        });

        message += `\n> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`;

        const sentMessage = await messageHandler.sendMessage(from, {
            image: { url: `https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true` },
            caption: message
        }, { quoted: quotedMessage });

        session[from] = { searchResults: songs, messageId: sentMessage.key.id };

        const handleUserReply = async (update) => {
            const userMessage = update.messages[0];
            if (!userMessage.message.extendedTextMessage ||
                userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
                return;
            }

            const userReply = userMessage.message.extendedTextMessage.text.trim();
            const songIndex = parseInt(userReply) - 1;

            if (isNaN(songIndex) || songIndex < 0 || songIndex >= songs.length) {
                return reply("⭕ *Please Enter A Valid Number.*");
            }

            const selectedSong = songs[songIndex];
            let downloadLink = await getSongDownloadLink(selectedSong.link);
            if (!downloadLink) return reply("❌ *Error Fetching Song Download Link.*");

            await messageHandler.sendMessage(from, {
                audio: { url: downloadLink },
                mimetype: 'audio/mpeg',
                fileName: `${selectedSong.title}.mp3`,
                caption: `🎵 *${selectedSong.title}*\n\n> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`
            }, { quoted: quotedMessage });
        };

        messageHandler.ev.on("messages.upsert", handleUserReply);
    } catch (error) {
        console.error(error);
        await messageHandler.sendMessage(from, { text: '❌ *Error Occurred During The Process!*' }, { quoted: quotedMessage });
    }
});
