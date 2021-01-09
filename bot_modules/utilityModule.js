// LIBRARY IMPORTS
const Discord = require('discord.js');

// MODULE IMPORTS
const ErrorModule = require('./errorLogger.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');

// OTHER STUFF
const roleRegex = new RegExp(/<@&(\d{17,19})>/g);



// THIS MODULE
module.exports = {
    /**
     * Check Message ID does exist
     * 
     * @param {String} messageID
     * @param {Discord.TextChannel} channel
     * 
     * @returns {Promise<Discord.Message>|null} wrapped Message, or NULL if invalid message ID
     */
    async CheckMessage(messageID, channel) {

        let message;

        try {
            message = await channel.messages.fetch(messageID);
        } catch (err) {
            console.error(err);
            return null;
        }

        return message;

        // END OF MODULE
    },


























    /**
     * Check Role does exist
     * 
     * @param {String} roleID
     * @param {Discord.Guild} guild
     * 
     * @returns {Promise<Discord.Role>|null} wrapped Role, or NULL if invalid Role
     */
    async CheckRole(roleID, guild) {

        // If a Role Mention, remove "<@&" and ">"
        if ( roleRegex.test(roleID) ) {
            roleID = roleID.replace('<@&', '');
            roleID = roleID.replace('>', '');
        }


        let role;

        try {
            role = await guild.roles.fetch(roleID);
        } catch (err) {
            console.error(err);
            return null;
        }

        return role;

        // END OF MODULE
    },







































    /**
     * Check Emoji does exist for the Bot
     * 
     * @param {String} emojiID
     * 
     * @returns {Promise<Discord.Emoji>|null} wrapped Role, or NULL if invalid Role
     */
    async CheckEmoji(emojiID) {

        let emoji;

        try {
            emoji = client.emojis.resolve(emojiID);
        } catch (err) {
            console.error(err);
            return null;
        }

        return emoji;

        // END OF MODULE
    }

};
