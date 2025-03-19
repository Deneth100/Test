const { fetchJson } = require('../lib/functions');
const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');


//================= BROADCAST TO GROUPS ========================
cmd({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, reply }) => {
    if (!isOwner) return reply("> ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ 🛑");
    if (args.length === 0) return reply("> ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴍᴇꜱꜱᴀɢᴇ ᴛᴏ ʙʀᴏᴀᴅᴄᴀꜱᴛ 📢");

    const message = args.join(' ');
    const groups = Object.keys(await conn.groupFetchAllParticipating());

    for (const groupId of groups) {
        await conn.sendMessage(groupId, { text: message }, { quoted: mek });
    }

    reply("> ᴍᴇꜱꜱᴀɢᴇ ʙʀᴏᴀᴅᴄᴀꜱᴛᴇᴅ ᴛᴏ ᴀʟʟ ɢʀᴏᴜᴘꜱ 📢");
});

//====================== GROUP JIDS =============================
cmd({
    pattern: "gjids",
    desc: "List all groups the bot is in with JIDs.",
    category: "info",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const groupMetadata = await conn.groupFetchAllParticipating();
        let message = "📋 *DENETH-MD GET GROUP JIDS* 📋\n\n";
        let groupCount = 0;

        for (const groupId in groupMetadata) {
            const groupInfo = groupMetadata[groupId];
            message += `*${++groupCount}. ${groupInfo.subject}*\n💬 JID: ${groupId}\n\n`;
        }

        // Adding the footer
        message += `> 𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 𝗗𝗘𝗡𝗘𝗧𝗛𝗗𝗘𝗩 𝗢𝗙𝗙𝗜𝗖𝗜𝗔𝗟®`;

        if (groupCount === 0) {
            return reply("> ɴᴏ ɢʀᴏᴜᴘꜱ ꜰᴏᴜɴᴅ 🙄");
        }

        // Fetch an image URL for the message
        const imageUrl = "https://github.com/deneth-hansaka-keerthirathna/DENETH-Media/blob/main/DENETH-MD%20V1.jpg?raw=true"; // Replace with a valid image URL

        // Send the message with the image
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: message,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`> ᴇʀʀᴏʀ ꜰᴇᴛᴄʜɪɴɢ ɢʀᴏᴜᴘꜱ: ${e.message} ❌`);
    }
});

//===================== BLOCK USER ==========================
cmd({
  pattern: "ban",
  fromMe: true,
  desc: "🚫 Ban a user from using the bot or quoted user",
  category: "owner",
  filename: __filename
}, async (bot, message, context, { args, reply, isOwner }) => {
  if (!isOwner) {
    return reply("❌ You are not the owner!");
  }
  
  const userToBan = (context.quoted ? context.quoted.sender : args[0])?.replace(/[^0-9]/g, '');
  
  if (!userToBan) {
    return reply("❗ Please provide a valid user number to ban or quote a user.");
  }
  
  const jidToBan = `${userToBan}@s.whatsapp.net`;
  const blacklistPath = path.join(__dirname, '../media/blacklist.json');
  let blacklist;
  
  try {
    blacklist = JSON.parse(fs.readFileSync(blacklistPath, "utf8"));
  } catch (error) {
    console.error("Error reading blacklist:", error);
    return reply("❗ Unable to read the blacklist data. Please try again later.");
  }
  
  if (!blacklist.jids.includes(jidToBan)) {
    blacklist.jids.push(jidToBan);
    fs.writeFileSync(blacklistPath, JSON.stringify(blacklist, null, 2), 'utf8');
    reply(`🚫 User ${jidToBan} has been banned from using the bot.`);
  } else {
    reply("❗ User is already banned.");
  }
});
//========================== UNBLOCK USER ==================================
cmd({
  pattern: "unblock",
  desc: "Unblock a user.",
  category: "owner",
  react: '✅',
  filename: __filename
}, async (bot, message, args, { from, isOwner, quoted, reply }) => {
  if (!isOwner) {
    return reply("> ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ 🛑");
  }
  if (!quoted) {
    return reply("> ᴘʟᴇᴀꜱᴇ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇ ᴜꜱᴇʀ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ʙʟᴏᴄᴋ 🙄");
  }
  const userToUnblock = quoted.sender;
  try {
    await bot.updateBlockStatus(userToUnblock, "unblock");
    reply(`> ${userToUnblock} ᴜɴʙʟᴏᴄᴋᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ✅`);
  } catch (error) {
    reply(`> ᴇʀʀᴏʀ ᴜɴʙʟᴏᴄᴋɪɴɢ ᴜꜱᴇʀ: ${error.message} ❌`);
  }
});

//==================== CLEARCHATS =======================
cmd({
  pattern: "clearchats",
  desc: "Clear all chats from the bot.",
  category: "owner",
  react: '🧹',
  filename: __filename
}, async (bot, message, args, { from, isOwner, reply }) => {
  if (!isOwner) {
    return reply("> ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ 🛑");
  }
  try {
    const chats = bot.chats.all();
    for (const chat of chats) {
      await bot.modifyChat(chat.jid, "delete");
    }
    reply("> ᴀʟʟ ᴄʜᴀᴛꜱ ᴄʟᴇᴀʀᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ 🧹");
  } catch (error) {
    reply(`> ᴇʀʀᴏʀ ᴄʟᴇᴀʀɪɴɢ ᴄʜᴀᴛꜱ: ${error.message} ❌`);
  }
});

//==================== FORWARD MESSAGE ==========================
cmd({
  pattern: "forward",
  desc: "Forward messages",
  alias: ['fo'],
  category: "owner",
  use: ".forward <Jid address>",
  filename: __filename
}, async (bot, message, args, { from, quoted, q, isOwner, isMe, reply }) => {
  if (!isOwner && !isMe) {
    return reply("> ʏᴏᴜ ᴀʀᴇ ɴᴏᴛ ᴛʜᴇ ᴏᴡɴᴇʀ 🛑");
  }
  if (!q) {
    return reply("> ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴛᴀʀɢᴇᴛ ᴊɪᴅ ᴀᴅᴅʀᴇꜱꜱ 🙄");
  }
  if (!quoted) {
    return reply("> ᴘʟᴇᴀꜱᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀ ᴍᴇꜱꜱᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ꜰᴏʀᴡᴀʀᴅ ❌");
  }
  const messageToForward = quoted.fakeObj ? quoted.fakeObj : quoted;
  try {
    await bot.sendMessage(q, { forward: messageToForward }, { quoted: message });
    return reply(`> ᴍᴇꜱꜱᴀɢᴇ ꜰᴏʀᴡᴀʀᴅᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴛᴏ:

${q} ✅`);
  } catch (error) {
    return reply("ꜰᴀɪʟᴇᴅ ᴛᴏ ꜰᴏʀᴡᴀʀᴅ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ❌");
  }
});

cmd({
    pattern: "left",
    desc: "🚪 Make the bot leave the group or remove a specific member",
    react: "👋",
    category: "general",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, reply, q }) => {
    try {
        if (!isGroup) {
            return reply("❌ This command can only be used in groups.");
        }
        
        if (q) {
            let mentionedNumber = q.replace(/[^0-9]/g, "");
            if (mentionedNumber.length < 10) {
                return reply("⚠️ Please provide a valid phone number to remove.");
            }
            await conn.groupParticipantsUpdate(from, [mentionedNumber + "@s.whatsapp.net"], "remove");
            return reply(`👋 Removed ${mentionedNumber} from the group.`);
        }
        
        await reply("👋 Leaving the group...");
        await conn.groupLeave(from);
    } catch (e) {
        console.error(e);
        return reply("⚠️ An error occurred while processing your request.");
    }
});

cmd({
    pattern: "kickall",
    desc: "🚨 Remove all members from a specified group",
    react: "⚠️",
    category: "general",
    filename: __filename
},
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) {
            return reply("❌ Please provide a group JID to remove all members.");
        }
        
        let groupMetadata = await conn.groupMetadata(q);
        let participants = groupMetadata.participants.map(p => p.id);
        
        for (let member of participants) {
            await conn.groupParticipantsUpdate(q, [member], "remove");
        }
        
        return reply(`🚨 All members have been removed from the group: ${q}`);
    } catch (e) {
        console.error(e);
        return reply("⚠️ An error occurred while removing members.");
    }
});
