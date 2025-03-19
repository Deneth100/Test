const config = require('../config');
const { cmd, commands } = require('../command');
const fetch = require('node-fetch');
const { fetchJson } = require('../lib/functions');
const axios = require('axios');

// Cinesubz Movies Share Jid
const API_KEY = 'deneth2009';
const SEARCH_API = 'https://deneth-dev-api-links.vercel.app/api/cinesubz-search';
const MOVIE_API = 'https://deneth-dev-api-links.vercel.app/api/cinesubz-movie';
const DOWNLOAD_API = 'https://deneth-dev-api-links.vercel.app/api/cinesubz-download';

let globalMovieResults = {};
let sharedMovieResults = {};

cmd({
    pattern: "cmvs",
    react: "🔍",
    desc: "Search movies with Sinhala subtitles.",
    category: "movies",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    if (!args.length) return reply("❌ *Please provide a movie name!*");

    let query = encodeURIComponent(args.join(" "));
    let response = await fetch(`${SEARCH_API}?q=${query}&api_key=${API_KEY}`);
    let data = await response.json();

    if (!data.status || !data.result.length) return reply("> ɴᴏ ᴄɪɴᴇꜱᴜʙᴢ ᴍᴏᴠɪᴇꜱ ʀᴇꜱᴜʟᴛ ꜰᴏᴜɴᴅ 🧐");

    let movies = data.result.filter(item => item.type === 'Movie');
    if (!movies.length) return reply("> ɴᴏ ᴄɪɴᴇꜱᴜʙᴢ ᴍᴏᴠɪᴇꜱ ꜰᴏᴜɴᴅ 🧐");

    let message = "🎬 𝗗𝗘𝗡𝗘𝗧𝗛-𝗠𝗗 𝗖𝗜𝗡𝗘𝗦𝗨𝗕𝗭 𝗠𝗢𝗩𝗜𝗘𝗦 𝗦𝗘𝗔𝗥𝗖𝗛 🎬\n\n";
    movies.forEach((item, index) => {
        message += `${index + 1}. *${item.title}*\n`;
    });

    message += "𝘐𝘧 𝘺𝘰𝘶 𝘸𝘢𝘯𝘵 𝘵𝘰 𝘴𝘦𝘯𝘥 𝘢 𝘮𝘰𝘷𝘪𝘦 𝘵𝘰 𝘺𝘰𝘶𝘳 𝘨𝘳𝘰𝘶𝘱, 𝘵𝘺𝘱𝘦 𝘤𝘮𝘷𝘴𝘩𝘢𝘳𝘦 <𝘫𝘪𝘥> <𝘯𝘶𝘮𝘣𝘦𝘳> 𝘢𝘯𝘥 𝘴𝘦𝘯𝘥 𝘪𝘵\n\n";
    message += "> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®";
    await conn.sendMessage(from, { text: message }, { quoted: mek });
    globalMovieResults[from] = movies;
});

cmd({
    pattern: "cmvshare",
    react: "📩",
    desc: "Send movie details to a user.",
    category: "movies",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    if (args.length < 2) return reply("> ᴜꜱᴀɢᴇ: ꜱᴇɴᴅ <ᴊɪᴅ> <ᴍᴏᴠɪᴇ ɴᴜᴍʙᴇʀ> ⛔");

    let jid = args[0];
    let index = parseInt(args[1]) - 1;

    if (!globalMovieResults[from] || isNaN(index) || index < 0 || index >= globalMovieResults[from].length) {
        return reply("> ɪɴᴠᴀʟɪᴅ ꜱᴇʟᴇᴄᴛɪᴏɴ! ᴄʜᴏᴏꜱᴇ ᴀ ᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ 🙄");
    }

    let movie = globalMovieResults[from][index];
    let movieResponse = await fetch(`${MOVIE_API}?url=${encodeURIComponent(movie.link)}&api_key=${API_KEY}`);
    let movieData = await movieResponse.json();
    if (!movieData.status) return reply("> ᴍᴏᴠɪᴇ ᴅᴇᴛᴀɪʟꜱ ɴᴏᴛ ꜰᴏᴜɴᴅ 😔");

    let details = movieData.result;
    let message = `🎬 *${details.title}* 🎬\n`;
    message += `🎭 Genres: ${details.genres.join(', ')}\n`;
    message += `📅 Release Date: ${details.releaseDate}\n`;
    message += `⭐ IMDB Rating: ${details.imdbRating}\n`;
    message += `🌍 Country: ${details.country}\n`;
    message += `🕑 Duration: ${details.duration}\n\n`;
    message += `📜 Description:\n${details.description}\n\n`;
    message += "> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®";

    let imageUrl = details.thumbImage || details.image;
    await conn.sendMessage(jid, {
            image: { url: imageUrl },
            caption: message,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        });
    sharedMovieResults[jid] = details.downloadLinks;

    // Send download links to the sender
    let dlMessage = "⬇ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 𝗟𝗜𝗡𝗞𝗦\n\n";
    details.downloadLinks.forEach((link, i) => {
        dlMessage += `${i + 1}. ${link.quality} | ${link.size}\n`;
    });
    dlMessage += "\n𝘙𝘦𝘱𝘭𝘺 𝘸𝘪𝘵𝘩 '𝘴𝘩𝘢𝘳𝘦𝘥𝘭 <𝘫𝘪𝘥> <𝘯𝘶𝘮𝘣𝘦𝘳>' 𝘵𝘰 𝘴𝘦𝘯𝘥 𝘢 𝘮𝘰𝘷𝘪𝘦 𝘧𝘪𝘭𝘦.";
    dlMessage += "\n\n> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®";
    await conn.sendMessage(from, { text: dlMessage }, { quoted: mek });

    reply("> ᴍᴏᴠɪᴇ ᴅᴇᴛᴀɪʟꜱ ꜱᴇɴᴛ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ✅");
});

cmd({
    pattern: "cmvdl",
    react: "⬇",
    desc: "Upload movie to a user.",
    category: "movies",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    if (args.length < 2) return reply("> ᴜꜱᴀɢᴇ: ꜱʜᴀʀᴇᴅʟ <ᴊɪᴅ> <ɴᴜᴍʙᴇʀ> ⛔");

    let jid = args[0];
    let index = parseInt(args[1]) - 1;

    if (!sharedMovieResults[jid] || isNaN(index) || index < 0 || index >= sharedMovieResults[jid].length) {
        return reply("> ɪɴᴠᴀʟɪᴅ ꜱᴇʟᴇᴄᴛɪᴏɴ! ᴄʜᴏᴏꜱᴇ ᴀ ᴠᴀʟɪᴅ ɴᴜᴍʙᴇʀ 🙄");
    }

    let selectedDownloadLink = sharedMovieResults[jid][index];
    let apiUrl = `${DOWNLOAD_API}?url=${encodeURIComponent(selectedDownloadLink.link)}&api_key=${API_KEY}`;

    try {
        let downloadResponse = await fetch(apiUrl);
        let downloadData = await downloadResponse.json();

        if (!downloadData?.data?.data?.data?.length) {
            return reply("> ɴᴏ ᴅɪʀᴇᴄᴛ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ ᴀᴠᴀɪʟᴀʙʟᴇ 😔");
        }

        let directLinks = downloadData.data.data.data.filter(link => link.type === "direct");
        if (directLinks.length === 0) {
            return reply("> ɴᴏ ᴅɪʀᴇᴄᴛ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ ᴀᴠᴀɪʟᴀʙʟᴇ 😔");
        }

        let directLink = directLinks[0].href;
        let fileName = directLinks[0].fileName || `${selectedDownloadLink.quality}.mp4`;
        let formattedFileName = `🎬 ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴄɪɴᴇᴍᴀ 🎬${fileName}`;

        await conn.sendMessage(jid, {
            document: { url: directLink },
            mimetype: 'video/mp4',
            fileName: formattedFileName,
            caption: `🎬 *${fileName} 🎬*\n${selectedDownloadLink.quality} | ${selectedDownloadLink.size}*\n\n> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`
        });

        reply("> ᴍᴏᴠɪᴇ ᴜᴘʟᴏᴀᴅᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ✅");
    } catch (error) {
        console.error("Download Error:", error);
        reply("> ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴇᴛᴄʜ ᴛʜᴇ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪɴᴋ.ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ 😔");
    }
});

cmd({
    pattern: "movie",
    desc: "Fetch detailed information about a movie.",
    category: "utility",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const movieName = args.join(' ');
        if (!movieName) {
            return reply("📽️ Please provide the name of the movie.");
        }

        const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=76cb7f39`;
        const response = await axios.get(apiUrl);

        const data = response.data;
        if (data.Response === "False") {
            return reply("🚫 Movie not found.");
        }

        const movieInfo = `
🎬 *DENETH-MD MOVIE INFOMATIONS* 🎬

🎥 *Title:* ${data.Title}
📅 *Year:* ${data.Year}
🌟 *Rated:* ${data.Rated}
📆 *Released:* ${data.Released}
⏳ *Runtime:* ${data.Runtime}
🎭 *Genre:* ${data.Genre}
🎬 *Director:* ${data.Director}
✍️ *Writer:* ${data.Writer}
🎭 *Actors:* ${data.Actors}
📝 *Plot:* ${data.Plot}
🌍 *Language:* ${data.Language}
🇺🇸 *Country:* ${data.Country}
🏆 *Awards:* ${data.Awards}
⭐ *IMDB Rating:* ${data.imdbRating}
🗳️ *IMDB Votes:* ${data.imdbVotes}
`;

        // Define the image URL
        const imageUrl = data.Poster && data.Poster !== 'N/A' ? data.Poster : config.ALIVE_IMG;

        // Send the movie information along with the poster image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `${movieInfo}\n> ᴅᴇɴᴇᴛʜ-ᴍᴅ ʙʏ ᴋɪɴɢ X ᴅᴇɴᴇᴛʜᴅᴇᴠ®`
        }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});

