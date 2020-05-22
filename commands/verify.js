let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');

module.exports = {
    name: 'verify',
    description: 'Used by newcomers to the Server to verify themselves',
    usage: ' ',
    //aliases: [''],
    //args: true,
    hidden: true,
    commandType: 'general',
    async execute(message) {

      // Prevent use outside Gateway Channel
      if ( message.channel.id !== '681806729389801472' ) {
        return message.reply("Sorry, but that command can only be used inside the Gateway Channel.");
      }

      
      // Fetch stuff
      let verifyRole = message.guild.roles.resolve('693183650317074453');
      let removeRole = member.guild.roles.resolve('712224145064067112');

      // Attach Role & delete message
      await message.member.roles.add(verifyRole, "Verification");
      await message.member.roles.remove(removeRole, "Verified");

      return await message.delete();



      //END OF COMMAND
    },
};
