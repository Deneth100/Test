const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

let session = {};

async function cineTvSearch(query) {
    try {
        const response = await fetchJson(`https://deneth-dev-api-links.vercel.app/api/cinesubz-search?q=${query}&api_key=deneth2009`);
        return response.result ? response.result.filter(tv => tv.type === "TV") : [];
    } catch (error) {
        console.error('Error fetching TV search results:', error);
        return [];
    }
}

async function getTvDetails(url) {
    try {
        const response = await fetchJson(`https://deneth-dev-api-links.vercel.app/api/cinesubz-tvshow?url=${url}&api_key=deneth2009`);
        return response.result || null;
    } catch (error) {
        console.error('Error fetching TV details:', error);
        return null;
    }
}

async function getEpisodeDetails(url) {
    try {
        const response = await fetchJson(`https://deneth-dev-api-links.vercel.app/api/cinesubz-episode?url=${url}&api_key=deneth2009`);
        return response.result || null;
    } catch (error) {
        console.error('Error fetching episode details:', error);
        return null;
    }
}

cmd({
    pattern: "cinetv",
    alias: ["cinesubztv"],
    use: '.cinetv <query>',
    react: "📺",
    desc: "Search and get TV shows from Cinesubz.",
    category: "search",
    filename: __filename
}, async (messageHandler, context, quotedMessage, { from, q, reply }) => {
    try {
        if (!q) return reply('⭕ *Please Provide A TV Show Name.*');

        let tvShows = await cineTvSearch(q);
        if (tvShows.length < 1) return reply("⭕ *No TV Shows Found!* 🙄");

        let message = `📺 *DENETH-MD CINESUBZ TV SEARCH* 📺\n\n`;
        tvShows.forEach((tv, index) => {
            message += `${index + 1}. ${tv.title}\n`;
        });

        message += `\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;

        const sentMessage = await messageHandler.sendMessage(from, {
            image: { url: `https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true` },
            caption: message
        }, { quoted: quotedMessage });

        session[from] = { searchResults: tvShows, messageId: sentMessage.key.id };

        const handleUserReply = async (update) => {
            const userMessage = update.messages[0];
            if (!userMessage.message.extendedTextMessage ||
                userMessage.message.extendedTextMessage.contextInfo.stanzaId !== sentMessage.key.id) {
                return;
            }

            const userReply = userMessage.message.extendedTextMessage.text.trim();
            const tvIndex = parseInt(userReply) - 1;

            if (isNaN(tvIndex) || tvIndex < 0 || tvIndex >= tvShows.length) {
                return reply("⭕ *Please Enter A Valid Number.*");
            }

            const selectedTv = tvShows[tvIndex];
            let details = await getTvDetails(selectedTv.link);
            if (!details) return reply("❌ *Error Fetching TV Show Details.*");

            let detailsMessage = `📺 *${details.title}* 📺\n\n` +
                `🎭 Genres: ${details.genres.join(', ')}\n` +
                `📅 First Air Date: ${details.firstAirDate}\n` +
                `🌎 Country: ${details.country}\n` +
                `⭐ IMDB: ${details.rating}\n` +
                `📜 Description: ${details.description}\n\n` +
                `> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;

            await messageHandler.sendMessage(from, {
                image: { url: details.poster },
                caption: detailsMessage
            }, { quoted: quotedMessage });

            // Send Episode List
            if (details.seasons && details.seasons.length > 0) {
                let episodeList = "";
                details.seasons.forEach(season => {
                    episodeList += `> SEASON ${season.seasonNumber}\n`;
                    season.episodes.forEach((ep, index) => {
                        episodeList += `${season.seasonNumber}.${index + 1} || ${ep.title}\n`;
                    });
                    episodeList += "\n";
                });

                await messageHandler.sendMessage(from, {
                    text: episodeList
                }, { quoted: quotedMessage });
            }

            // If user selects episode in format "1.1"
            const episodeReply = userReply.split('.'); // Handle case like 1.1 for episodes
            if (episodeReply.length === 2) {
                const seasonNumber = parseInt(episodeReply[0]);
                const episodeNumber = parseInt(episodeReply[1]);

                if (isNaN(seasonNumber) || isNaN(episodeNumber)) {
                    return reply("⭕ *Invalid episode number format.*");
                }

                const episode = details.seasons[seasonNumber - 1]?.episodes[episodeNumber - 1];
                if (!episode) {
                    return reply("⭕ *Episode not found.*");
                }

                // Fetch episode details using the API
                const episodeDetails = await getEpisodeDetails(episode.link);
                if (!episodeDetails) {
                    return reply("❌ *Error fetching episode details.*");
                }

                const epDetails = episodeDetails.result;
                const episodeMessage = `*${epDetails.title}*\n\n` +
                    `Release Date: ${epDetails.releaseDate}\n` +
                    `Description: ${epDetails.description}\n\n` +
                    `DOWNLOAD OPTIONS\n` +
                    epDetails.downloadLinks.map((link, index) => 
                        `${index + 1}. ${link.quality} | ${link.size}`).join('\n');

                await messageHandler.sendMessage(from, {
                    image: { url: epDetails.episodeImages[0] },
                    caption: episodeMessage
                }, { quoted: quotedMessage });
            }
        };

        messageHandler.ev.on("messages.upsert", handleUserReply);
    } catch (error) {
        console.error(error);
        await messageHandler.sendMessage(from, { text: '❌ *Error Occurred During The Process!*' }, { quoted: quotedMessage });
    }
});
