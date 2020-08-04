let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const fs = require('fs');
const { client } = require('../bot_modules/constants.js');
let lockdownJSON = require('../bot_storage/lockdownStatus.json');

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
      let removeRole = message.guild.roles.resolve('712224145064067112');

      // Attach Role & delete message
      await message.member.roles.add(verifyRole, "Verification");
      await message.member.roles.remove(removeRole, "Verified");



      // Check if Lockdown is in progress
      let lockdownRole = message.guild.roles.resolve('705044968552529960');

      if ( lockdownJSON["status"] === 1 ) {
        await message.member.roles.add(lockdownRole);
      }

      return await message.delete();



      //END OF COMMAND
    },
};
