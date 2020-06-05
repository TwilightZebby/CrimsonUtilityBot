let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');
let reactionRoleStore = require('../bot_storage/reactionRoles.json');

module.exports = {
    name: 'reactrole',
    description: 'Used for managing the Reaction Role Systems',
    usage: '<check>',
    aliases: ['rr'],
    args: true,
    ownerOnly: true,
    //hidden: true,
    commandType: 'general',
    async execute(message, args) {

      let guildObj = message.guild;

      
      // Check first argument
      switch ( args[0].toLowerCase() ) {

        case 'check':
          // Check all the menus stored in JSON file against their Discord Messages
          // If the Bot has yet to place its own reaction on said Message, add it.
          
          // Notification Roles
          let notifyChannel = guildObj.channels.resolve(reactionRoleStore["selfRoleMenu"].channelID);
          await notifyChannel.messages.fetch();
          let notifyMenu = notifyChannel.messages.resolve(reactionRoleStore["selfRoleMenu"].messageID);


          let menuReactions = Array.from(notifyMenu.reactions.cache.values());
          let intervalStore = null;
          let i = 0;

          intervalStore = client.setInterval( async () => {

            if ( menuReactions[i].me === false ) {

              let emoji = menuReactions[i].emoji;
              await notifyMenu.react(emoji).catch(console.error);

            }

            i++;

            if ( i === menuReactions.length ) {
              client.clearInterval(intervalStore);
            }

          }, 1000);

          await message.reply(`Reaction Check for myself complete.`);
          break;


        default:
          return await message.reply(`Sorry, but that isn't an accepted option. Please try again...`);

      }



      //END OF COMMAND
    },
};
