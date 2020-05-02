let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

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


      // Send Embed, then attach emojis onto it
      let suggestMessage = await suggestChannel.send(suggestEmbed);
      
      let upvoteEmoji = message.guild.emojis.resolve('706036093597777990');
      let downvoteEmoji = message.guild.emojis.resolve('706036093157638225');

      await suggestMessage.react(upvoteEmoji);
      await suggestMessage.react(downvoteEmoji);

      await message.reply(`Your suggestion has been posted in ${suggestChannel}!`);
      await message.delete();


      return;


      //END OF COMMAND
    },
};
