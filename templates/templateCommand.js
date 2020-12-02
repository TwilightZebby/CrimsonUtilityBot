// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// VARIABLE IMPORTS
const { client } = require('../constants.js');
let { PREFIX } = require('../config.js');

// MODULE IMPORTS, IF ANY


// THIS COMMAND
module.exports = {
    name: '',
    description: '',
    usage: ' ',

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
    cooldown: 3,

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
      
      //.

      //END OF COMMAND
    },
};
