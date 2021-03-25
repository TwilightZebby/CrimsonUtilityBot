// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');
const SlashCommands = require('../bot_modules/slashModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');
const { RegisterCommands } = require('../bot_modules/slashModule.js');



// THIS COMMAND
module.exports = {
    name: 'ping',
    description: 'See if the Bot is online and responsive',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {Discord.Guild} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guild, data, commandData, member) {

      return await SlashCommands.Callback(data, `${member.displayName}, your ping is ${member.client.ws.ping.toFixed(2)}ms`);

      //END OF SLASH COMMAND
    },











    /**
     * Registers the Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
     async register(isGlobal, guildID) {
      // Data
      const data = {};
      data.name = "ping";
      data.description = "Test if the Bot responds";

      if ( isGlobal ) {
        client.api.applications(client.user.id).commands().post({data});
      }
      else {
        client.api.applications(client.user.id).guilds(guildID).commands().post({data});
      }

      return;
    }
};
