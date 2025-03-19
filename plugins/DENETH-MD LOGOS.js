const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

const generateLogo = async (conn, from, q, reply, url, captionText, mek) => {
    try {
        if (!q) return reply('Please provide a name for the logo!');

        const encodedQuery = encodeURIComponent(q);
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=${url}&name=${encodedQuery}`;

        const response = await axios.get(apiUrl);
        
        if (response.data.status && response.data.result.download_url) {
            const imageUrl = response.data.result.download_url;
            await conn.sendMessage(from, { image: { url: imageUrl }, caption: `${captionText}, ${q}!` }, { quoted: mek });
        } else {
            reply(`Failed to generate the ${captionText} logo. Please try again later!`);
        }
    } catch (error) {
        console.error(error);
        reply(`An error occurred while generating the ${captionText} logo.`);
    }
};

const logos = [
    { pattern: "blackpink", desc: "Blackpink style logo", url: "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html", caption: "Here is your Blackpink logo" },
    { pattern: "blackpink2", desc: "Blackpink text effect logo", url: "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html", caption: "Here is your Blackpink logo" },
    { pattern: "blackpink3", desc: "Blackpink text effect logo", url: "https://en.ephoto360.com/create-a-blackpink-neon-logo-text-effect-online-710.html", caption: "Here is your Blackpink logo" },
    { pattern: "glitch1", desc: "Glitch text effect logo", url: "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html", caption: "Here is your Glitch logo" },
    { pattern: "naruto", desc: "Naruto text effect logo", url: "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html", caption: "Here is your Naruto logo" },
    { pattern: "comic", desc: "Comic text effect logo", url: "https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html", caption: "Here is your Comic logo" },
    { pattern: "light", desc: "Light text effect logo", url: "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html", caption: "Here is your Light logo" },
    { pattern: "tattoo", desc: "Tattoo text effect logo", url: "https://en.ephoto360.com/arrow-tattoo-effect-with-signature-712.html", caption: "Here is your Tattoo logo" },
    { pattern: "galaxy", desc: "Galaxy text effect logo", url: "https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html", caption: "Here is your Galaxy logo" },
    { pattern: "typography", desc: "Typography text effect logo", url: "https://en.ephoto360.com/create-online-typography-art-effects-with-multiple-layers-811.html", caption: "Here is your Typography logo" },
    { pattern: "beach", desc: "Beach text effect logo", url: "https://en.ephoto360.com/create-3d-text-effect-on-the-beach-online-688.html", caption: "Here is your Beach logo" }
];

logos.forEach(({ pattern, desc, url, caption }) => {
    cmd({ pattern, desc, category: "fun", filename: __filename }, async (conn, mek, m, { from, q, reply }) => {
        await generateLogo(conn, from, q, reply, url, caption, mek);
    });
});
