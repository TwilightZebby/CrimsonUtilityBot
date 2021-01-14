// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'access',
    description: 'Gain access to the Server',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args
     */
    async execute(message, args) {

      // Make sure command is used in Gateway Channel
      if ( message.channel.id !== "681806729389801472" ) { 
        return await message.channel.send(`${message.member.displayName} - this command can only be used in <#681806729389801472> !`);
      }

      // Roles
      let gatewayRole = await message.guild.roles.fetch('712224145064067112', true);
      let memberRole = await message.guild.roles.fetch('693183650317074453', true);

      // Swap Member's Roles
      await message.member.roles.remove(gatewayRole, "Passed Verification");
      await message.member.roles.add(memberRole);


      // Check if there's a lockdown in process
      //     - If there is, add Lockdown Role as well
      let lockdownJSON = require('../hiddenJsonFiles/lockdownStatus.json');
      if ( lockdownJSON["status"] === 1 ) {
        let lockdownRole = await message.guild.roles.fetch("705044968552529960");
        await message.member.roles.add(lockdownRole);
      }

      return;

      // END OF COMMAND
    },
};
