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
    name: 'suggest',
    description: 'Suggest something for the Crimson Levels Bot or this Server',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 300,

    /**
     * Command's functionality
     * 
     * @param {Discord.Guild} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guild, data, commandData, member) {

      if ( !commandData.options ) {
        return await SlashCommands.CallbackEphemeral(data, `I don't know how you managed to use this command without any inputs ${member.displayName} - but you shouldn't have. Consider this an error message!`);
      }
      else {


        // Check length of suggestion
        let suggestionString = commandData.options[0].value;

        if ( suggestionString.length > 1024 ) {
          return await SlashCommands.CallbackEphemeral(data, `Sorry ${member.displayName} - suggestions are limited to being 1024 characters long at most. You sent ${suggestionString.length} characters...`);
        }




        // Prepare stuff
        let ticketNumbersJSON = require('../hiddenJsonFiles/ticketNumbers.json');
        ticketNumbersJSON["suggestion"] += 1;




        // First, save to JSON file
        fs.writeFile('./hiddenJsonFiles/ticketNumbers.json', JSON.stringify(ticketNumbersJSON, null, 4), async (err) => {
          if (err) {
            console.error(err);
          }
        });









        // Create Embed
        const embed = new Discord.MessageEmbed().setColor('#008fba')
        .setTitle(`Suggestion #${ticketNumbersJSON["suggestion"]}`)
        .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addFields(
          {
            name: `Submitter`,
            value: `${member.user.username}#${member.user.discriminator}`,
            inline: true
          },
          {
            name: `Highest Role`,
            value: `\<\@\&${member.roles.highest.id}\>`,
            inline: true
          },
          {
            name: `Suggestion`,
            value: suggestionString
          }
        )
        .setTimestamp(Date.now());



        // Fetch Channel & send
        let suggestionChannel = guild.channels.resolve('693366417755602945');
        let suggestionMessage = await suggestionChannel.send(embed);

        // edit embed once sent to attach Message ID
        embed.setFooter(`ID: ${suggestionMessage.id}`);
        await suggestionMessage.edit(` `, embed);



        // Attach reactions
        let upvoteEmoji = guild.emojis.resolve('706036093597777990');
        let downvoteEmoji = guild.emojis.resolve('706036093157638225');

        
        // Timeouts because strict API rate limits on POST Reactions
        setTimeout(async () => {
          await suggestionMessage.react(upvoteEmoji);
        }, 1000);
        
        setTimeout(async () => {
          await suggestionMessage.react(downvoteEmoji);
        }, 2000);


        delete embed; // free up cache


        // send user response
        return await SlashCommands.CallbackEphemeral(data, `Your suggestion has been posted! (See the Suggestion Channel: \<\#693366417755602945\> )`);
        
        

      }

      // END OF SLASH COMMAND
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
      data.name = "suggest";
      data.description = "Suggest something for the Crimson Levels Bot or this Server";
      data.options = new Array();


      // Options
      const option = {};

      option.name = "message";
      option.description = "Your suggestion";
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
