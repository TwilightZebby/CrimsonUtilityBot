// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');
const slashModule = require('../bot_modules/slashModule.js');



// THIS COMMAND
module.exports = {
    name: 'accept',
    description: 'Used to accept Suggestions',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args
     */
    async execute(message, args) {

      // Check args
      if ( args.length < 2 ) {
        return await message.channel.send(`Sorry ${message.member.displayName} - I couldn't see an ID or reason....`);
      }


      // Prepare
      let suggestionChannel = message.guild.channels.resolve('693366417755602945');
      let suggestionArchiveChannel = message.guild.channels.resolve('693375621321195562');
      let suggestionMessageID = args.shift();
      let acceptReason = args.join(' ');


      // Try to fetch message
      let suggestionMessage;

      try {
        suggestionMessage = await suggestionChannel.messages.fetch(suggestionMessageID);
      } catch (err) {
        return await message.channel.send(`Sorry ${message.member.displayName} - I couldn't find that Suggestion in \<\#693366417755602945\>`);
      }




      // Fetch Suggestion details & embed,
      //     then add acceptance reason & reaction counts
      let suggestionEmbed = suggestionMessage.embeds.shift();
      let suggestionReactions = Array.from(suggestionMessage.reactions.cache.values());
      
      suggestionEmbed.addFields(
        {
          name: `Total Votes`,
          value: `${suggestionReactions[0].emoji} : ${suggestionReactions[0].count}\n${suggestionReactions[1].emoji} : ${suggestionReactions[1].count}`
        },
        {
          name: `Reason`,
          value: `${acceptReason}`
        }
      );



      // Send to Archive Channel
      await suggestionArchiveChannel.send(suggestionEmbed);

      // Delete from Suggestion Channel
      await suggestionMessage.delete({ timeout: 5000 });

      return await message.channel.send(`Accepted Suggestion!`);

      // END OF COMMAND
    },
};
