let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

module.exports = {
    name: 'deny',
    description: 'Used to deny a Suggestion',
    usage: '<suggestionID> <reason>',
    //aliases: [''],
    args: true,
    ownerOnly: true,
    commandType: 'suggestion',
    async execute(message, args) {

      // Error Checking
      if ( args.length < 2 ) {
        return message.reply(`BUZZ! Sorry, but there wasn't a reason attached to that command!`);
      }

      
      // Fetch channels needed
      let suggestionChannel = message.guild.channels.resolve('693366417755602945');
      let archiveChannel = message.guild.channels.resolve('693375621321195562');


      // Split args
      let messageID = args.shift();
      let denyReason = args.join(' ');


      // Attempt to fetch message/suggestion
      let suggestionMessage = null;

      try {
        suggestionMessage = await suggestionChannel.messages.fetch(messageID);
      } catch (err) {
        return message.reply(`Sorry, but I was unable to find that suggestion!`);
      }

      let messageContent = suggestionMessage.content;
      let messageAuthor = suggestionMessage.author;
      let messageDate = suggestionMessage.createdAt;
      let messageEmbed = suggestionMessage.embeds[0];
      let messageReactions = Array.from(suggestionMessage.reactions.cache.values());
      let upvoteCount = messageReactions[0].count;
      let downvoteCount = messageReactions[1].count;

      let upvoteEmoji = message.guild.emojis.resolve('706036093597777990');
      let downvoteEmoji = message.guild.emojis.resolve('706036093157638225');


      // Tweak Embed to reflect new status
      messageEmbed.setDescription(`**Total Votes:**\n${upvoteEmoji} : ${upvoteCount}\n\n${downvoteEmoji} : ${downvoteCount}`);
      messageEmbed.setTitle(`Denied Suggestion`);
      messageEmbed.setTimestamp(messageDate);
      messageEmbed.setColor('#99060b');
      messageEmbed.addFields(
        { name: `Reason (by ${message.member.displayName})`, value: denyReason }
      );


      // Send new Embed to 
      await archiveChannel.send(messageEmbed);
      
      // Delete original suggestion for tidiness
      await suggestionMessage.delete({ timeout: 5000, reason: `Denied suggestion` });



      //END OF COMMAND
    },
};
