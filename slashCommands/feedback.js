// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');
const SlashCommands = require('../bot_modules/slashModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'feedback',
    description: 'Give feedback regarding the Crimson Levels Bot',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 600,

    /**
     * Command's functionality
     * 
     * @param {Discord.Guild} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guild, data, commandData, member) {

      // Grab input
      if ( !commandData.options ) {
        return await SlashCommands.CallbackEphemeral(data, `I don't know how you managed to use this command without any inputs ${member.displayName} - but you shouldn't have. Consider this an error message!`);
      }
      else {

        /**
         * @type {String}
         */
        let feedbackString = commandData.options[0].value;

        // Check string length
        if ( feedbackString.length > 2047 ) {
          return await SlashCommands.CallbackEphemeral(data, `Sorry ${member.displayName} - but the maximum length for feedback is 2047 characters. You sent ${feedbackString.length} characters. Please shorten your feedback :)`);
        }


        // Embed
        const embed = new Discord.MessageEmbed().setColor('#008fba')
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setTitle(`Feedback by ${member.user.username}#${member.user.discriminator}`)
        .setDescription(feedbackString);


        // Fetch channel & send
        let feedbackChannel = guild.channels.resolve('693366455525179403');
        await feedbackChannel.send(embed);
        delete embed; // free up cache


        // Send User Response
        return await SlashCommands.CallbackEphemeral(data, `Successfully posted your Feedback to the Feedback Channel ( \<\#693366455525179403\> )`);

      }

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
      data.name = "feedback";
      data.description = "Give feedback regarding the Crimson Levels Bot";
      data.options = new Array();


      // Options
      const option = {};

      option.name = "message";
      option.description = "Your feedback";
      option.type = 3; // String
      option.required = true;

      data.options.push(option);

      if ( isGlobal ) {
        client.api.applications(client.user.id).commands().post({data});
      }
      else {
        client.api.applications(client.user.id).guilds(guildID).commands().post({data});
      }

      return;
    }
};
