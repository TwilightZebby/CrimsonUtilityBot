let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

module.exports = {
    name: 'time',
    description: 'Shows the current time in real life in the UK.',
    usage: ' ',
    aliases: ['clock'],
    //args: true,
    //ownerOnly: true,
    //hidden: true,
    commandType: 'general',
    async execute(message, args) {
      
      // Fetch stuff and make Variables
      let now = new Date();
      let timeNow = now.toTimeString();
      let timeEmbed = new Discord.MessageEmbed().setColor('#07f51b');

      timeEmbed.setTitle(`Current time in UK:`)
      .setDescription(`${timeNow}`);

      return await message.channel.send(timeEmbed);


      //END OF COMMAND
    },
};
