const config = require('../config')
const {cmd, commands} = require('../command')
const {runtime} = require('../lib/functions')

cmd({
    pattern: "kick2",
    desc: "Kick a member from the group using their phone number.",
    category: "admin",
    react: "❌",
    filename: __filename
},
async(conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
try {
    if (!isGroup) {
        return reply("This command can only be used in groups!");
    }

    if (!isAdmins && !isOwner) {
        return reply("You need to be an admin or the group owner to use this command.");
    }

    // Check if phone number is provided
    if (!args || !args[0]) {
        return reply("Please provide the phone number of the member to kick.");
    }

    const phoneNumber = args[0];
    const phoneNumberFormatted = phoneNumber.replace(/[^\d]/g, '');

    // Find member based on phone number
    const member = participants.find(p => p.id.includes(phoneNumberFormatted));
    if (!member) {
        return reply("Member with that phone number is not in the group.");
    }

    // Use groupParticipantsUpdate to remove the member
    await conn.groupParticipantsUpdate(from, [member.id], 'remove');  // 'remove' kicks the member

    reply(`Successfully kicked the member with phone number: ${phoneNumber}`);
} catch (e) {
    console.log(e);
    reply(`Error: ${e.message}`);
}
})

cmd({
    pattern: "kickall2",
    desc: "Remove all members from the group except admins.",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isOwner, groupMetadata, participants, reply }) => {
    try {
        if (!isGroup) {
            await conn.sendReaction("❌", from);
            return reply("This command can only be used in groups!");
        }

        if (!isAdmins && !isOwner) {
            await conn.sendReaction("❌", from);
            return reply("You need to be an admin or the group owner to use this command.");
        }

        // Get list of all members except admins
        const membersToKick = participants.filter(p => !p.admin).map(p => p.id);

        if (membersToKick.length === 0) {
            await conn.sendReaction("✅", from);
            return reply("There are no members to remove.");
        }

        // Remove members in chunks to avoid API limits
        for (let i = 0; i < membersToKick.length; i += 5) {
            await conn.groupParticipantsUpdate(from, membersToKick.slice(i, i + 5), 'remove');
        }

        await conn.sendReaction("✅", from);
        reply("Successfully removed all non-admin members from the group.");
    } catch (e) {
        console.log(e);
        await conn.sendReaction("❌", from);
        reply(`Error: ${e.message}`);
    }
});

cmd({
    pattern: "add",
    desc: "Add a member to the group using their phone number.",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isOwner, args, reply }) => {
    try {
        if (!isGroup) {
            await conn.sendReaction("❌", from);
            return reply("This command can only be used in groups!");
        }

        if (!isAdmins && !isOwner) {
            await conn.sendReaction("❌", from);
            return reply("You need to be an admin or the group owner to use this command.");
        }

        if (!args || !args[0]) {
            await conn.sendReaction("❌", from);
            return reply("Please provide the phone number of the member to add.");
        }

        const phoneNumber = args[0].replace(/[^\d]/g, '') + "@s.whatsapp.net";

        await conn.groupParticipantsUpdate(from, [phoneNumber], 'add');
        await conn.sendReaction("✅", from);
        reply(`Successfully added the member with phone number: ${args[0]}`);
    } catch (e) {
        console.log(e);
        await conn.sendReaction("❌", from);
        reply(`Error: ${e.message}`);
    }
});

cmd({
    pattern: "upgpp",
    desc: "Update the group profile picture.",
    category: "admin",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isOwner, quoted, mime, reply }) => {
    try {
        if (!isGroup) {
            await conn.sendReaction("❌", from);
            return reply("This command can only be used in groups!");
        }

        if (!isAdmins && !isOwner) {
            await conn.sendReaction("❌", from);
            return reply("You need to be an admin or the group owner to use this command.");
        }

        if (!quoted || !/image/.test(mime)) {
            await conn.sendReaction("❌", from);
            return reply("Please reply to an image to set it as the group profile picture.");
        }

        let media = await quoted.download();
        await conn.updateProfilePicture(from, media);
        await conn.sendReaction("✅", from);
        reply("Successfully updated the group profile picture.");
    } catch (e) {
        console.log(e);
        await conn.sendReaction("❌", from);
        reply(`Error: ${e.message}`);
    }
});
