const axios = require("axios");
const { Buffer } = require("buffer");
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
  pattern: "img",
  desc: "Search and send images from Google.",
  react: "🏞️",
  category: "media",
  filename: __filename,
}, async (
  bot,
  message,
  match,
  {
    from,
    quoted,
    body,
    command,
    args,
    q,
    reply,
  }
) => {
  try {
    if (!q) {
      return reply("Please provide a search query for the image.");
    }

    const query = encodeURIComponent(q);
    const apiKey = "AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI"; // Replace with your actual API key
    const cx = "baf9bdb0c631236e5"; // Replace with your actual Search Engine ID
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&cx=${cx}&key=${apiKey}&searchType=image&num=5`;

    const response = await axios.get(searchUrl);
    const data = response.data;

    if (!data.items || data.items.length === 0) {
      return reply("No images found for your query.");
    }

    for (let i = 0; i < data.items.length; i++) {
      const imageUrl = data.items[i].link;
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(imageResponse.data, "binary");

      await bot.sendMessage(
        from,
        {
          image: imageBuffer,
          caption: `\n*⛬ Image ${i + 1} from your search! ⛬*\n\n> Powered by Supun MD`,
        },
        { quoted: message }
      );
    }
  } catch (error) {
    console.error(error);
    reply("Error: " + error.message);
  }
});
