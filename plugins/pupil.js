const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios');

let movieSearchResults = [];

cmd({
    pattern: "pupil",
    desc: "Search for a movie and get download links.",
    category: "search",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const movieName = args.join(' ');

        if (!movieName) {
            return reply('Please provide a movie name.');
        }

        const apiUrl = `https://deneth-dev-api-links.vercel.app/api/pupil-search?q=${movieName}&api_key=deneth2009`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.status) {
            movieSearchResults = data.result;

            let message = "*_Search Results:_*\n\n";
            data.result.forEach((movie, index) => {
                message += `*${index + 1}. ${movie.title}*\n🔗 [Link](${movie.url})\n\n`;
            });
            message += "_Reply with the number of the movie to get more details._";

            await conn.sendMessage(from, {
                image: { url: 'https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true' },
                caption: message,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                }
            }, { quoted: mek });

            // Store session data
            commands[from] = { step: 'selectMovie', movieSearchResults };

        } else {
            reply('No results found.');
        }
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

cmd({
    pattern: "info",
    desc: "Get movie details and download links by selecting the movie number.",
    category: "search",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const session = commands[from];

        if (session?.step !== 'selectMovie') {
            return reply("Please start a movie search first by typing `.movie [movie name]`.");
        }

        const userInput = body.trim().replace(/[^\d]/g, '');  // Remove non-number characters
        const movieIndex = parseInt(userInput) - 1;  // Convert to index (1-based to 0-based)

        console.log(`User Input: ${userInput}, Movie Index: ${movieIndex}`);

        if (isNaN(movieIndex) || movieIndex < 0 || movieIndex >= session.movieSearchResults.length) {
            return reply(`❗ Invalid movie number. Please reply with a valid number between 1 and ${session.movieSearchResults.length}.`);
        }

        const selectedMovie = session.movieSearchResults[movieIndex];
        const movieInfoApiUrl = `https://deneth-dev-api-links.vercel.app/api/pupil-download?q=${encodeURIComponent(selectedMovie.url)}&api_key=deneth2009`;
        const movieInfoResponse = await axios.get(movieInfoApiUrl);
        const movieInfoData = movieInfoResponse.data;

        if (movieInfoData.title) {
            let movieMessage = `*${movieInfoData.title}*\n`;
            movieMessage += `Description: ${movieInfoData.description}\n`;
            movieMessage += `Release Date: ${movieInfoData.releaseDate}\n`;
            movieMessage += `Author: ${movieInfoData.author}\n\n`;

            // Send movie info with image (if available)
            const imageUrl = movieInfoData.image ? movieInfoData.image : 'https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true';  // Fallback image if no movie image
            await conn.sendMessage(from, {
                image: { url: imageUrl },
                caption: movieMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                }
            }, { quoted: mek });

            // Provide download options in numbered format
            let downloadMessage = '⬇️ Please select a download link by replying with the number:\n\n';  // Emoji changed to ⬇️
            movieInfoData.downloadLinks.forEach((link, index) => {
                downloadMessage += `${index + 1}. *${link.linkText}* (Size: ${link.fileSize})\n`;
            });

            // Send download options
            await conn.sendMessage(from, { text: downloadMessage }, { quoted: mek });

            // Store the download links
            commands[from].downloadLinks = movieInfoData.downloadLinks;

        } else {
            reply('Could not retrieve movie details.');
        }
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

cmd({
    pattern: "download",
    desc: "Download a movie by replying with the number of the download link.",
    category: "download",
    react: "⬇️",  // Changed emoji to ✅ after upload
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const session = commands[from];

        if (!session?.downloadLinks) {
            return reply("Please select a movie first to get download options by typing `.movieinfo [movie number]`.");
        }

        const userInput = body.trim().replace(/[^\d]/g, '');  // Remove non-number characters
        const downloadIndex = parseInt(userInput) - 1;

        if (isNaN(downloadIndex) || downloadIndex < 0 || downloadIndex >= session.downloadLinks.length) {
            return reply(`❗ Invalid download link number. Please reply with a valid number between 1 and ${session.downloadLinks.length}.`);
        }

        const selectedDownloadLink = session.downloadLinks[downloadIndex];
        const directLink = selectedDownloadLink.downloadLink; // The direct link to download the movie file

        // Send the movie as a file (MP4 format)
        await conn.sendMessage(from, {
            document: {
                url: directLink
            },
            mimetype: 'video/mp4',
            fileName: `ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴍᴏᴠɪᴇꜱ(${selectedDownloadLink.linkText}).mp4`,
            caption: `${selectedDownloadLink.linkText}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
        }, { quoted: mek });

        // Send confirmation message with ✅ after download is complete
        await conn.sendMessage(from, { text: '✅ Movie download complete!' }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
