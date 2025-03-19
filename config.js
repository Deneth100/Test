const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "Sv4QDAgL#pKt6f2e8_hWK7zk8cTipV4IYxbiSqFIOXXWd5Mhwaps",
// ANTI TOOLS
ANTI_DELETE: process.env.ANTI_DELETE || "true",
};
