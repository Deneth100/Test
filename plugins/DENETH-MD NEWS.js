const { fetchJson } = require('../lib/functions');
const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

// ==================== DERANA NEWS =============================
cmd({
  pattern: "derana",
  desc: "Get latest Derana news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/derana?&api_key=deneth2009");

    // Validate response structure
    if (!response.data || !response.data.status || !response.data.latestNews) {
      return reply("❌ Failed to fetch news or invalid response format.");
    }

    const news = response.data.latestNews;

    // Validate if required fields exist
    if (!news.title || !news.date || !news.desc || !news.url || !news.image) {
      return reply("❌ Missing news details in the API response.");
    }

    const newsMessage = `📰 *DENETH-MD DERANA NEWS* 📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.url}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;

    await bot.sendMessage(message.chat, { 
      image: { url: news.image }, 
      caption: newsMessage ,
      contextInfo: { forwardingScore: 999, isForwarded: true }
    }, { quoted: message });

  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});

// ==================== HIRU NEWS =============================
cmd({
  pattern: "hiru",
  desc: "Get latest Hiru news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/hiru?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD HIRU NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.link}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.img }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== BBC NEWS =============================
cmd({
  pattern: "bbc",
  desc: "Get latest BBC news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/bbc?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD BBC NEWS*📰\n\n⭕ Title: ${news.title}\n✍ Description: ${news.desc}\n🔗 URL: ${news.url}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.image }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== LANKADEEPA NEWS =============================
cmd({
  pattern: "lankadeepa",
  desc: "Get latest Lankadeepa news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/lankadeepa?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD LANKADEEPA NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.url}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.image }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== ITN NEWS =============================
cmd({
  pattern: "itn",
  desc: "Get latest ITN news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/itn?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD ITN NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.link}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.image }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== SIRASA NEWS =============================
cmd({
  pattern: "sirasa",
  desc: "Get latest sirasa news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/sirasa?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD SIRASA NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.url}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.image }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== SIYATHA NEWS =============================
cmd({
  pattern: "siyatha",
  desc: "Get latest Siyatha news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/siyatha?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD SIYATHA NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.link}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.image }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== NETH NEWS =============================
cmd({
  pattern: "nethnews",
  desc: "Get latest Neth news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/nethnews?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD NETH NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.link}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.image }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== LNW NEWS =============================
cmd({
  pattern: "lnw",
  desc: "Get latest LNW news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/lnw?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD LNW NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.link}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: `https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true` }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== DASATHALANKA NEWS =============================
cmd({
  pattern: "dasathalanka",
  desc: "Get latest Dasathalanka news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/dasathalanka?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD DASATHALANKA NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.link}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.image }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== GOSSIPLANKA NEWS =============================
cmd({
  pattern: "gossiplanka",
  desc: "Get latest Gossiplanka news.",
  category: "news",
  react: '📰',
  filename: __filename
}, async (bot, message, args, { reply }) => {
  try {
    const response = await axios.get("https://deneth-dev-api-links.vercel.app/api/gossiplanka?&api_key=deneth2009");
    if (!response.data.status) {
      return reply("❌ Failed to fetch news.");
    }
    const news = response.data.result;
    const newsMessage = `📰*DENETH-MD GOSSIPLANKA NEWS*📰\n\n⭕ Title: ${news.title}\n📅 Date: ${news.date}\n✍ Description: ${news.desc}\n🔗 URL: ${news.link}\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜᴅᴇᴠ ᴏꜰꜰɪᴄɪᴀʟ®`;
    await bot.sendMessage(message.chat, { image: { url: news.image }, caption: newsMessage , contextInfo: { forwardingScore: 999, isForwarded: true }}, { quoted: message });
  } catch (error) {
    console.error("Error fetching news:", error);
    return reply("❌ Error retrieving news. Please try again later.");
  }
});
// ==================== CRICBUZZ NEWS =============================
