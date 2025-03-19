const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "movie2",
  desc: "Search and show top Sinhala subtitles for films.",
  react: '🎬',
  category: "download",
  filename: __filename
}, async (bot, message, args, { from, q, reply }) => {
  try {
    if (!q || q.trim() === '') {
      return reply("*⚠️කරුණාකර නමක් ලබා දෙන්න⚠️,(E.g .sinhalasub Spider-Man)*");
    }

    const searchUrl = `https://www.dark-yasiya-api.site/movie/sinhalasub/search?text=${encodeURIComponent(q)}`;

    const fetchData = async (url, retries = 5) => {
      try {
        const { data } = await axios.get(url);
        return data;
      } catch (error) {
        if (retries === 0) throw error;
        console.log(`Retrying... (${retries} retries left)`);
        return await fetchData(url, retries - 1);
      }
    };

    const response = await fetchData(searchUrl);

    if (!response || !response.result || response.result.data.length === 0) {
      return reply("⚠️සොයාගත නොහැකි විය කරුණාකර අවුරුද්ද ඇතුලත් කරන්න⚠️, (E.g .sinhalasub Love 2015)*");
    }

    const moviesList = response.result.data.slice(0, 20);
    const movieText = moviesList.map((movie, index) => `${index + 1}. 🎬 *${movie.title} (${movie.year})*`).join("\n\n");

    const searchResults = `🎥 *Didula MD Movie Sinhala Sub Search,*
    
🔍 *Search Results for:* *${q}*

${movieText}

> Reply with a number to Select a movie.`;

    const sentMessage = await bot.sendMessage(from, { text: searchResults }, { quoted: message });
    const messageId = sentMessage?.key?.id;

    if (!messageId) return;

    bot.ev.on("messages.upsert", async (chatUpdate) => {
      const incomingMessage = chatUpdate.messages[0];
      if (!incomingMessage.message) return;

      const userReply = incomingMessage.message.conversation || incomingMessage.message.extendedTextMessage?.text;
      const isReplyToBot = incomingMessage.message.extendedTextMessage?.contextInfo?.stanzaId === messageId;

      if (isReplyToBot && /^[0-9]+$/.test(userReply)) {
        const selectedIndex = parseInt(userReply) - 1;
        if (selectedIndex < 0 || selectedIndex >= moviesList.length) {
          return reply("*❌ නිවැරදි අංකයක් Reply කරන්න, (E.g 1-20)*");
        }

        const selectedMovie = moviesList[selectedIndex];
        const movieLink = selectedMovie.link;

        let movieDetails;
        try {
          movieDetails = await fetchData(`https://www.dark-yasiya-api.site/movie/sinhalasub/movie?url=${movieLink}`);
        } catch (error) {
          return reply("*❌ දෝශයක් කරුනාකර නැවතත් උත්සහ කරන්න😞*");
        }

        if (!movieDetails || !movieDetails.result || !movieDetails.result.data) {
          return reply("*❌සමාවෙන්න,Film එකට අදාල Detail සොයාගත නොහැකි විය,කරුනාකර නැවතත් උත්සහ කරන්න😞*");
        }

        const { title, date, imdbRate, country, runtime, dl_links, images } = movieDetails.result.data;
        if (!dl_links || dl_links.length < 3) {
          return reply("සමාවෙන්න, මේ Film එකට අදාල Download Link සොයාගත නොහැකිය. Cine Sub Cmd(.cine) භාවිතාකර Film එක තිබේදැයි බලන්න😏");
        }

        let downloadOptions = `
🎥 ᴅɪᴅᴜʟᴀ ᴍᴅ ᴍᴏᴠɪᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ 🎥

*☘️ Title:* *${title || "N/A"}*
*📆 Release:* *${date || "N/A"}*
*⭐️ IMDb Rating:* *${imdbRate || "N/A"}*
*🌎 Country:* *${country || "N/A"}*
*⏰ Runtime:* *${runtime || "N/A"}*

🔽 *Download Options:* 
1️⃣ *480p* | 📦 Size: ${dl_links[2]?.size} | Reply '2.1'
2️⃣ *720p* | 📦 Size: ${dl_links[1]?.size} | Reply '2.2'
3️⃣ *1080p* | 📦 Size: ${dl_links[0]?.size} | Reply '2.3'

📌 *Reply with the number to download the movie.*`;

        await bot.sendMessage(from, { text: downloadOptions }, { quoted: message });

        bot.ev.on("messages.upsert", async (downloadUpdate) => {
          const downloadMsg = downloadUpdate.messages[0];
          if (!downloadMsg.message) return;

          const downloadReply = downloadMsg.message.conversation || downloadMsg.message.extendedTextMessage?.text;
          if (!["2.1", "2.2", "2.3"].includes(downloadReply)) return;

          let downloadUrl;
          if (downloadReply === "2.1") {
            downloadUrl = dl_links[2]?.link.replace("/u/", "/api/file/");
          } else if (downloadReply === "2.2") {
            downloadUrl = dl_links[1]?.link.replace("/u/", "/api/file/");
          } else if (downloadReply === "2.3") {
            downloadUrl = dl_links[0]?.link.replace("/u/", "/api/file/");
          }

          if (downloadUrl) {
            await bot.sendMessage(from, {
              document: { url: downloadUrl },
              mimetype: "video/mp4",
              fileName: `🎬 ${title}.mp4`,
              caption: `*🎬 Name:* ${title}\n\n> *Powered by Didula MD* 🎥✨`
            }, { quoted: downloadMsg });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    reply("Error: " + (error.message || error));
  }
});
