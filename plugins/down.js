const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

cmd({
    pattern: "down1",
    desc: "Download a file from a given URL",
    category: "general",
    react: "⬇️",
    filename: __filename
}, async (conn, mek, m, { from, body, reply }) => {
    try {
        // Extract the URL from the command
        const args = body.split(" ");
        if (args.length < 2) return reply("❗ Please provide a valid download URL. Example: `.download <url>`");

        const downloadUrl = args[1];
        reply("⏳ *Downloading file...*");

        // Define the file name
        const fileName = `downloaded_file.mp4`; // Change extension if needed
        const filePath = path.join(__dirname, fileName);

        // Download the file
        const writer = fs.createWriteStream(filePath);
        const downloadStream = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream'
        });

        downloadStream.data.pipe(writer);
        
        writer.on('finish', async () => {
            reply("✅ *Download complete! Uploading to WhatsApp...*");

            await conn.sendMessage(from, {
                document: fs.readFileSync(filePath),
                mimetype: 'video/mp4', // Change based on file type
                fileName: `ᴅᴇɴᴇᴛʜ-ᴍᴅ ᴅᴏᴡɴʟᴏᴀᴅ.mp4`,
                caption: `🎬 *Your requested file is ready!*\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇɴᴇᴛʜ-xᴅ ᴛᴇᴄʜ®`
            }, { quoted: mek });

            // Delete the file after sending
            fs.unlinkSync(filePath);
        });

        writer.on('error', (err) => {
            console.error("Download failed:", err);
            reply("❗ Error: Failed to download the file. Please try again.");
        });

    } catch (error) {
        console.error("Error downloading file:", error);
        reply("❗ Error: Something went wrong. Please try again later.");
    }
});
