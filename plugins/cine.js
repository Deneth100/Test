const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

let session = {};

async function cineMovieSearch(query) {
    try {
        const response = await fetchJson(`https://deneth-dev-api-links.vercel.app/api/cinesubz-search?q=${query}&api_key=deneth2009`);
        return response.result ? response.result.filter(movie => movie.type === "Movie") : [];
    } catch (error) {
        console.error('Error fetching movie search results:', error);
        return [];
    }
}

async function getMovieDetails(url) {
    try {
        const response = await fetchJson(`https://deneth-dev-api-links.vercel.app/api/cinesubz-movie?url=${url}&api_key=deneth2009`);
        return response.result || null;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

async function getDownloadLinks(url) {
    try {
        const response = await fetchJson(`https://deneth-dev-api-links.vercel.app/api/cinesubz-download?url=${url}&api_key=deneth2009`);
        return response.data.data.data || [];
    } catch (error) {
        console.error('Error fetching download links:', error);
        return [];
    }
}

cmd({
    pattern: "cinemovie",
    alias: ["cinesubz"],
    use: '.cinemovie <query>',
    react: "🎬",
    desc: "Search and get movies from Cinesubz.",
    category: "search",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('⭕ *Please Provide A Movie Name.*');

        let movies = await cineMovieSearch(q);
        if (movies.length < 1) return reply("⭕ *No Movies Found!* 🙄");

        let message = `🎬 *DENETH-MD CINESUBZ SEARCH* 🎬\n\n`;
        movies.forEach((movie, index) => {
            message += `${index + 1}. ${movie.title}\n`;
        });

        message += `\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;

        const sentMessage = await messageHandler.sendMessage(from, {
            image: { url: `https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true` },
            caption: message
        }, { quoted: quotedMessage });

        session[from] = { searchResults: movies, messageId: sentMessage.key.id };

        const handleUserReply = async (update) => {
            const userMessage = update.messages[0];
            if (!userMessage.message.extendedTextMessage ||
                userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
                return;
            }

            const userReply = userMessage.message.extendedTextMessage.text.trim();
            const movieIndex = parseInt(userReply) - 1;

            if (isNaN(movieIndex) || movieIndex < 0 || movieIndex >= movies.length) {
                return reply("⭕ *Please Enter A Valid Number.*");
            }

            const selectedMovie = movies[movieIndex];
            let details = await getMovieDetails(selectedMovie.link);
            if (!details) return reply("❌ *Error Fetching Movie Details.*");

            let detailsMessage = `🎬 *${details.title}* 🎬\n\n` +
                `🎭 Genres: ${details.genres.join(', ')}\n` +
                `📅 Release Date: ${details.releaseDate}\n` +
                `🌎 Country: ${details.country}\n` +
                `⭐ IMDB: ${details.imdbRating}\n` +
                `🕑 Duration: ${details.duration}\n` +
                `📜 Description: ${details.description}\n\n` +
                `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;

            await messageHandler.sendMessage(from, {
                image: { url: details.thumbImage || details.image },
                caption: detailsMessage
            }, { quoted: quotedMessage });

            let downloadMessage = `📥 *Select a Download Option:*\n\n`;
            details.downloadLinks.forEach((link, index) => {
                downloadMessage += `${index + 1}. ${link.quality} | ${link.size} | ${link.language}\n`;
            });

            const downloadMsg = await messageHandler.sendMessage(from, { text: downloadMessage }, { quoted: quotedMessage });

            session[from] = { movieDetails: details, messageId: downloadMsg.key.id };

            messageHandler.ev.on("messages.upsert", async (update) => {
                const userMessage = update.messages[0];
                if (!userMessage.message.extendedTextMessage ||
                    userMessage.message.extendedTextMessage.contextInfo.stanzaId !== downloadMsg.key.id) {
                    return;
                }

                const userReply = userMessage.message.extendedTextMessage.text.trim();
                const downloadIndex = parseInt(userReply) - 1;

                if (isNaN(downloadIndex) || downloadIndex < 0 || downloadIndex >= details.downloadLinks.length) {
                    return reply("⭕ *Please Enter A Valid Number.*");
                }

                const selectedDownloadLink = details.downloadLinks[downloadIndex];
                let downloadLinks = await getDownloadLinks(selectedDownloadLink.link);
                let directLink = downloadLinks.find(link => link.type === "direct")?.href;

                if (!directLink) return reply("❌ *No Direct Download Link Found!* 🙄");

                await messageHandler.sendMessage(from, { react: { text: "⬇", key: userMessage.key } });

                await messageHandler.sendMessage(from, {
                    document: { url: directLink },
                    mimetype: 'video/mp4',
                    fileName: selectedDownloadLink.quality + "_Movie.mp4",
                    caption: `🎬 *${selectedDownloadLink.quality} | ${selectedDownloadLink.size}*\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴛᴇᴄʜ®`
                }, { quoted: quotedMessage });

                await messageHandler.sendMessage(from, { react: { text: "✅", key: userMessage.key } });
            });
        };

        messageHandler.ev.on("messages.upsert", handleUserReply);
    } catch (error) {
        console.error(error);
        await messageHandler.sendMessage(from, { text: '❌ *Error Occurred During The Process!*' }, { quoted: quotedMessage });
    }
});
