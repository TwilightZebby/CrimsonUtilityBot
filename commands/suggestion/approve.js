let { PREFIX } = require('../../config.js');
const Discord = require("discord.js");
const fs = require('fs');
const { client } = require('../../bot_modules/constants.js');

module.exports = {
    name: 'approve',
    description: 'Used to Approve Suggestions that were sent to a Ticket Channel',
    usage: '<suggestionID>',
    //aliases: [''],
    args: true,
    ownerOnly: true,
    commandType: 'suggestion',
    async execute(message, args) {
      
      // Fetch channels and messages needed
      let ticketChannel = message.channel;
      let suggestionChannel = message.guild.channels.resolve('693366417755602945');
      
      // Attempt to fetch message/suggestion
      let suggestionMessage = null;

      try {
        suggestionMessage = await ticketChannel.messages.fetch(args.shift());
      } catch (err) {
        return message.reply(`Sorry, but I was unable to find that suggestion!`);
      }


      // Copy Suggestion over to channel and attach Emojis
      let suggestEmbed = suggestionMessage.embeds[0];
      let copiedMsg = await suggestionChannel.send(suggestEmbed);

      let upvoteEmoji = message.guild.emojis.resolve('706036093597777990');
      let downvoteEmoji = message.guild.emojis.resolve('706036093157638225');

      await copiedMsg.react(upvoteEmoji);
      await copiedMsg.react(downvoteEmoji);


      await message.reply(`Suggestion was approved and copied to ${suggestionChannel}!`);



      //END OF COMMAND
    },
};
