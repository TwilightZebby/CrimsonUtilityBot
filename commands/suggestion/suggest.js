let { PREFIX } = require('../../config.js');
const Discord = require("discord.js");
const { client } = require('../../bot_modules/constants.js');

let ticketNumber = 1;

module.exports = {
    name: 'suggest',
    description: `Use to suggest stuff!`,
    usage: '<suggestion>',
    //aliases: [''],
    args: true,
    commandType: 'suggestion',
    async execute(message, args) {
      
      // Turn suggestion into a string
      let suggestion = args.join(' ');

      // Fetch Suggestion Channel
      let suggestChannel = message.guild.channels.resolve('693366417755602945');




      const suggestEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Suggestion Module');


      // Grab details
      let userName = message.member.displayName;
      let userObj = message.author;
      let userAvatar = message.author.displayAvatarURL();
      let userHighestRole = message.member.roles.highest;


      // Form Embed
      suggestEmbed.setTitle(`New Suggestion by ${userName}`);
      suggestEmbed.setThumbnail(userAvatar);
      suggestEmbed.addFields(
        { name: `Submitter`, value: userObj, inline: true },
        { name: `Highest Role`, value: userHighestRole, inline: true },
        { name: `Suggestion`, value: suggestion }
      );




      // ATTACHMENT CHECK
      let msgAttachments = Array.from(message.attachments.values());


      // IF NO ATTACHMENT
      //    Continue as normal
      if ( !msgAttachments.length ) {

        // Send Embed, then attach emojis onto it
        let suggestMessage = await suggestChannel.send(suggestEmbed);
        
        let upvoteEmoji = message.guild.emojis.resolve('706036093597777990');
        let downvoteEmoji = message.guild.emojis.resolve('706036093157638225');

        await suggestMessage.react(upvoteEmoji);
        await suggestMessage.react(downvoteEmoji);

        await message.reply(`Your suggestion has been posted in ${suggestChannel}!`);
        await message.delete();


        return;

      }
      // IF YES ATTCHMENT
      else {

        let attachmentURL = msgAttachments[0].url;

        // Send through approval queue

        let ticketSectionChannel = message.guild.channels.resolve('697509368547115078');
        
        
        // Create PermissionOverwrites Object for below Ticket Channel
        let permOverwrite = {
          id: message.author.id,
          allow: 'VIEW_CHANNEL'
        }

        let parentPermissions = Array.from(ticketSectionChannel.permissionOverwrites.values());


        // Create new Ticket Channel
        let ticketChannel = await message.guild.channels.create(`suggestion-${ticketNumber}`, {
          type: 'text',
          topic: `${message.member.displayName}'s Suggestion (requires approval due to Attachment)`,
          parent: ticketSectionChannel,
          permissionOverwrites: [ parentPermissions[0], parentPermissions[1], parentPermissions[2], parentPermissions[3], parentPermissions[4], permOverwrite ],
          reason: `Suggestion submitted that needs approval`
        });



        // Send Suggestion in Ticket, after adding Attachment
        suggestEmbed.setImage(attachmentURL);

        await ticketChannel.send(suggestEmbed);
        await ticketChannel.send(`▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\nThis Suggestion needs approval before being displayed due to an attachment!\n\n\<\@156482326887530498\> will be here shortly, so please stand by.`);

        
        // Notify Sender
        await message.reply(`I have detected an attachment (image, etc) on this Suggestion. Thus, it has been sent for approval just to ensure the attachment isn't rule-breaking.`);
        await message.delete();

        ticketNumber++; // Just to prevent Dup Ticket Numbers in one sesson

        return;

      }


      //END OF COMMAND
    },
};
