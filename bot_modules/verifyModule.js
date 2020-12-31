// LIBRARY IMPORTS
const Discord = require('discord.js');

// MODULE IMPORTS
const ErrorModule = require('./errorLogger.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS MODULE
module.exports = {
    /**
     * Gateway Channel & Role on Member Join
     * 
     * @param {Discord.GuildMember} member 
     * @param {Discord.TextChannel} gatewayChannel
     * @param {Discord.Role} gatewayRole
     */
    async OnJoin(member, gatewayChannel, gatewayRole) {

        // Grant Gateway Role
        await member.roles.add(gatewayRole);



        // Lock channel to prevent using !access for 5 minutes
        await gatewayChannel.createOverwrite(member, {
            SEND_MESSAGES: false
        }, "New Member, lock channel for 5 mins")
        .catch(async err => { return ErrorModule.LogCustom(err, `Error while locking Gateway Channel for **${member.user.username}#${member.user.discriminator}**`) });



        // Unlock Gateway Channel after 5 minutes
        client.setTimeout(async () => {
            await gatewayChannel.permissionOverwrites.get(member.user.id).delete();

            // Send reminder & auto-clear it after 1 hour
            await (await gatewayChannel.send(`Hey there ${member}! This is a friendly reminder to verify yourself so you can gain access to the rest of the Server!`)).delete({ timeout: 3.6e+6 });
        }, 300000);

        return;

        // END OF MODULE
    }

};
