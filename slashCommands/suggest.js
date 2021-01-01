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
        return await SlashCommands.CallbackEphemeral(data, 3, `I don't know how you managed to use this command without any inputs ${member.displayName} - but you shouldn't have. Consider this an error message!`);
      }
      else {



        // Prepare stuff
        let suggestionString = commandData.options[0].value;
        let suggestionJSON = require('../hiddenJsonFiles/suggestions.json');
        let ticketNumbersJSON = require('../hiddenJsonFiles/ticketNumbers.json');
        ticketNumbersJSON["suggestion"] += 1;




        // First, save to JSON files
        suggestionJSON[ ticketNumbersJSON["suggestion"] ] = {
          userID: member.user.id,
          username: member.user.username,
          discrim: member.user.discriminator,
          userAvatar: member.user.displayAvatarURL({ format: 'png', dynamic: true }),
          dateTime: Date.now(),
          suggestion: suggestionString,
          status: "pending",
          note: " ",
          attachment: " "
        };



        fs.writeFile('./hiddenJsonFiles/suggestions.json', JSON.stringify(suggestionJSON, null, 4), async (err) => {
          if (err) {
            console.error(err);
            return await SlashCommands.CallbackEphemeral(data, 3, `Sorry ${member.displayName} - something wrong happened while processing your suggestion. Please try again later...`);
          }
        });

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

        delete embed; // free up cache


        // send user response
        return await SlashCommands.CallbackEphemeral(data, 3, `Your suggestion has been posted! (See the Suggestion Channel: \<\#693366417755602945\> )`);
        
        

      }

      // END OF SLASH COMMAND
    }
};
