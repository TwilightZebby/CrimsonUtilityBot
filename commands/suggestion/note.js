let { PREFIX } = require('../../config.js');
const Discord = require("discord.js");
const fs = require('fs');
const { client } = require('../../bot_modules/constants.js');

module.exports = {
    name: 'note',
    description: 'Adds a Note to the specified Suggestion',
    usage: '<suggestionID> <note>',
    //aliases: [''],
    args: true,
    ownerOnly: true,
    commandType: 'suggestion',
    async execute(message, args) {
      
      // Error Checking
      if ( args.length < 2 ) {
        return message.reply(`BUZZ! Sorry, but there wasn't a note attached to that command!`);
      }

      
      // Fetch channels needed
      let suggestionChannel = message.guild.channels.resolve('693366417755602945');


      // Split args
      let messageID = args.shift();
      let note = args.join(' ');


      // Attempt to fetch message/suggestion
      let suggestionMessage = null;

      try {
        suggestionMessage = await suggestionChannel.messages.fetch(messageID);
      } catch (err) {
        return message.reply(`Sorry, but I was unable to find that suggestion!`);
      }



      // Search for Attachments
      let msgAttachments = Array.from(message.attachments.values());




      // IF NO ATTACHMENTS
      if ( !msgAttachments.length ) {

        // Edit Embed to add Note
        let messageEmbed = suggestionMessage.embeds[0];
        messageEmbed.addFields(
          { name: `Note (from ${message.member.displayName})`, value: note }
        );

        await suggestionMessage.edit(messageEmbed);

        return message.reply(`Successfully added note to ${suggestionMessage.author.username}'s Suggestion!`);

      }
      // YES ATTACHMENTS
      else {

        let msgAttachmentURL = msgAttachments[0].url;


        // Edit Embed to add Note
        let messageEmbed = suggestionMessage.embeds[0];
        messageEmbed.addFields(
          { name: `Note (from ${message.member.displayName})`, value: note }
        );
        messageEmbed.setImage(msgAttachmentURL);

        await suggestionMessage.edit(messageEmbed);

        return message.reply(`Successfully added note & attachment to ${suggestionMessage.author.username}'s Suggestion!`);

      }



      //END OF COMMAND
    },
};
