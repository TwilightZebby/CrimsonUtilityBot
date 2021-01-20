// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
const ErrorModule = require('../bot_modules/errorLogger.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'help',
    description: 'Displays a list of my commands',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 5,

    /**
     * Command's functionality
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args
     */
    async execute(message, args) {

      const { commands, slashCommands } = client;

      const embed = new Discord.MessageEmbed().setColor('#07f51b')
      .addFields(
        {
          name: `Regular Commands (eg: !help)`,
          value: message.author.id === "156482326887530498" ? commands.map(command => command.name).join(', ') : commands.filter(command => !command.limitation).map(command => command.name).join(', ')
        },
        {
          name: `Slash Commands (eg: /suggest)`,
          value: message.author.id === "156482326887530498" ? slashCommands.map(command => command.name).join(', ') : slashCommands.filter(command => !command.limitation).map(command => command.name).join(', ')
        }
      )
      .setFooter(`Help Command triggered by ${message.member.displayName}`);

      return await message.channel.send(embed);

      // END OF COMMAND
    },
};
