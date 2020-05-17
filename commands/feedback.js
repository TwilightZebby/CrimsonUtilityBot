let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

module.exports = {
    name: 'feedback',
    description: 'Give feedback for the CrimsonRoulette Bot!',
    usage: '<feedback>',
    //aliases: [''],
    args: true,
    commandType: 'general',
    async execute(message, args) {
      
      // Variables
      const feedbackEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Feedback Module');
      let feedback = args.join(' ');
      let feedbackChannel = message.guild.channels.resolve('693366455525179403');



      // Check length of Feedback
      if ( feedback.length > 2047 ) {

        return await message.reply(`Sorry, but your feedback was too large! Please try again with a shorter feedback...\n(Feedback was ${feedback.length - 2047} characters over the limit)`);

      }


      // Slap Feedback and Details into Embed
      feedbackEmbed.setTitle(`Feedback by ${message.author.username}\#${message.author.discriminator}`)
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(feedback);

      return await feedbackChannel.send(feedbackEmbed);


      //END OF COMMAND
    },
};
