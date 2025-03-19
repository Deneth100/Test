const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "apk",
    desc: "Search and download APKs",
    category: "utility",
    react: "📥",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args || args.length === 0) {
            return reply("Please provide an app name to search.");
        }

        const query = args.join(" ");
        const searchUrl = `https://www.dark-yasiya-api.site/search/apk?text=${encodeURIComponent(query)}`;
        
        const searchResponse = await axios.get(searchUrl, { timeout: 5000 });
        if (!searchResponse.data.status || !searchResponse.data.result?.data?.length) {
            return reply("No APKs found for your search query.");
        }

        const firstResult = searchResponse.data.result.data[0];
        const downloadUrl = `https://www.dark-yasiya-api.site/download/apk?id=${firstResult.id}`;
        
        const downloadResponse = await axios.get(downloadUrl, { timeout: 5000 });
        if (!downloadResponse.data.status) {
            return reply("Failed to retrieve APK details.");
        }

        const apk = downloadResponse.data.result;
        const apkInfo = `⬇ *DENETH-MD APK DOWNLOAD* ⬇\n\n*Name:* ${apk.name}\n*Size:* ${apk.size}\n*Last Update:* ${apk.lastUpdate}\n*Package Name:* ${apk.package}\n\n> DENETHDEV`;
        
        await conn.sendMessage(m.chat, { image: { url: apk.image }, caption: apkInfo }, { quoted: mek });
        await conn.sendMessage(m.chat, { document: { url: apk.dl_link }, mimetype: 'application/vnd.android.package-archive', fileName: `${apk.name}.apk` }, { quoted: mek });
        
    } catch (error) {
        console.error(error);
        if (error.response) {
            reply(`Error ${error.response.status}: ${error.response.statusText}`);
        } else if (error.request) {
            reply("No response from server. Please try again later.");
        } else {
            reply("An error occurred while processing your request.");
        }
    }
});
