const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "2y40Sbya#JwvGkk-iwOuUyrNZxFwknnUMZEjbECszikb4_BqH6RA",
// ANTI TOOLS
ANTI_DELETE: process.env.ANTI_DELETE || "true",
};
