// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
const ErrorModule = require('../bot_modules/errorLogger.js');
const UtilityModule = require('../bot_modules/utilityModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');

// OTHER STUFF
//const validActions = [ "add", "edit", "remove" ];
const validActions = [ "check" ];


// THIS COMMAND
module.exports = {
    name: 'rr',
    description: 'Manages the Reaction Role Menu(s)',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 10,

    /**
     * Command's functionality
     * 
     * @param {Discord.Message} message 
     * @param {Array<String>} args
     */
    async execute(message, args) {

      // Check args
      if ( !args ) {
        return await message.channel.send(`Sorry ${message.member.displayName} - You didn't provide any arguments.\nCorrect syntax: \`${PREFIX}rr check <messageID>\``);
      }

      if ( args.length !== 2 ) {
        return await message.channel.send(`Sorry ${message.member.displayName} - You didn't include all the required arguments!\nCorrect Syntax: \`${PREFIX}rr check <messageID>\``);
      }



      // grab inputs
      const argAction = args.shift().toLowerCase();
      const argMessage = args.shift();


      // Check inputs
      //     - Check Action
      if ( !validActions.includes(argAction) ) {
        return await message.channel.send(`Sorry ${message.member.displayName} - That first argument wasn't a valid action!`);
      }

      if ( await UtilityModule.CheckMessage(argMessage, message.channel) === null ) {
        return await message.channel.send(`Sorry ${message.member.displayName} - That second argument wasn't a valid Message ID!\n(Must be the ID of a Message sent in the same channel you use this command in)`);
      }








      switch (argAction) {

        case "check":
          // If the Bot hasn't added its own Reactions to the specified Message, add them
          let messageMenu = await message.channel.messages.fetch(argMessage); // Fetch message for the cache
          let menuReactions = Array.from(messageMenu.reactions.cache.values());
          let intervalStore = null;
          let i = 0;

          intervalStore = client.setInterval( async () => {

            if ( i === menuReactions.length ) {
              client.clearInterval(intervalStore);
              await message.channel.send(`Checked reactions for the given Message`);
            }



            if ( menuReactions[i].me === false ) {
              let emoji = menuReactions[i].emoji;
              await messageMenu.react(emoji).catch(console.error);
            }

            i++;

          }, 1000);

          return;



        default:
          return;

      }

      


      // END OF COMMAND
    },
};
