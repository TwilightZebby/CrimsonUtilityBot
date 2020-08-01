let { PREFIX } = require('../../config.js');
const Discord = require("discord.js");
const fs = require('fs');
const { client } = require('../../bot_modules/constants.js');

module.exports = {
    name: 'close',
    description: 'Closes a Ticket Channel',
    usage: '[Reason]',
    //aliases: [''],
    //args: true,
    ownerOnly: true,
    commandType: 'ticket',
    async execute(message, args) {
      
      // Fetch details
      let ticketChannel = message.channel;
      let ticketName = ticketChannel.name;


      if ( ticketName.startsWith('suggestion') ) {

        // CLOSE SUGGESTION TICKET
        let logChannel = message.guild.channels.resolve('706808376918671401');

        await message.channel.send(`**Closing Suggestion Ticket...**`);


        // Fetch messages
        let ticketContents = await ticketChannel.messages.fetch({limit:100});
        let contentArray = Array.from(ticketContents.values());
        let originEmbed = contentArray[contentArray.length - 1].embeds[0];
        let originUser = originEmbed.fields[0].value;

        // Fetch User Obj
        let originalMember = message.guild.members.resolve(originUser.slice(2, originUser.length - 1));


        // DIVIDER FOR LOG CHANNEL
        const logEmbed = new Discord.MessageEmbed().setColor('#08a3a1').setFooter('Suggestion Ticket Log');
        
        logEmbed.setTitle(`Ticket Details`);
        logEmbed.addFields(
          { name: `User`, value: originalMember, inline: true },
          { name: `Highest Role`, value: originalMember.roles.highest, inline: true },
          { name: `Ticket Type`, value: `Suggestion`, inline: true },
          { name: `Ticket Created`, value: ticketChannel.createdAt.toDateString() }
        );

        if ( args.length >= 1 ) {
          logEmbed.addFields({ name: `Reason for Ticket Closure`, value: args.join(' ') });
        }

        await logChannel.send(logEmbed);



        // Copy transcript of Channel's contents        
        for ( let i = contentArray.length - 1; i >= 0; i-- ) {

          let ticketMsg = contentArray[i];

          if ( !ticketMsg.embeds.length ) {

            await logChannel.send(`\`**${ticketMsg.author.username}**\``);
            await logChannel.send(ticketMsg);

          } else {

            await logChannel.send(`\`**${ticketMsg.author.username}**\``);
            let copyEmbed = ticketMsg.embeds[0];
            await logChannel.send(copyEmbed);

          }

        }


        await logChannel.send(`__**Logging Completed**__`);

      }





      // Delete Channel
      await ticketChannel.delete();

      



      //END OF COMMAND
    },
};
