// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// VARIABLE IMPORTS
const { client } = require('../constants.js');
let { PREFIX } = require('../config.js');

// MODULE IMPORTS, IF ANY


// THIS COMMAND
module.exports = {
    name: 'ping',
    description: 'Returns your average ping to the Bot in milliseconds',
    usage: [ `${PREFIX}ping ` ],

    // Type of Command
    //     - Use 'general' if not in a sub-folder within .\commands\
    commandType: 'general',
    
    // Alterative command names
    //aliases: [''],

    // Are Arguments required for this command
    //args: true,

    // LIMITATIONS
    //     'owner' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'owner',

    // Command's cooldown, in seconds
    cooldown: 10,

    // FLAGS
    //     Any flags the Command has (eg: "--boop")
    //     FORMAT: [ [ '--flagOne', `Flag Description` ], [ '--flagTwo', `Flag Description` ], ... ]
    //flags: []

    /**
     * Command's functionality
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args 
     */
    async execute(message, args) {
      
      return await client.throttleCheck(message.channel, `Pong!\n> Your ping is ${message.client.ws.ping.toFixed(2)}ms`, message.author.id);

      //END OF COMMAND
    },
};
