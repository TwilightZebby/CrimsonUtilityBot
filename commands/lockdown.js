// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
const ErrorModule = require('../bot_modules/errorLogger.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');

// OTHER STUFF
const validActions = [ "start", "end" ];



// THIS COMMAND
module.exports = {
    name: 'lockdown',
    description: 'Used to start or end a Server-wide lockdown',

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

      // Check for args
      if ( !args || !args.length ) {
        return await message.channel.send(`Sorry, but you didn't provide any arguments!\nExpected: \`${PREFIX}lockdown start|end reason\``);
      }

      if ( args.length < 2 ) {
        return await message.channel.send(`Sorry, but you didn't provide enough arguments.\nExpected: \`${PREFIX}lockdown start|end reason\``);
      }



      // Check action
      let action = args.shift().toLowerCase();
      if ( !validActions.includes(action) ) {
        return await message.channel.send(`Sorry, but that wasn't a valid Lockdown action.\nExpected: \`${PREFIX}lockdown start|end reason\``);
      }




      // Prepare stuff
      let lockdownRole = await message.guild.roles.fetch("705044968552529960");
      let lockdownInfoChannel = message.guild.channels.resolve("705046342019580006");
      let allMembers = (await message.guild.members.fetch()).array().filter(member => !member.user.bot);
      let lockdownJSON = require('../hiddenJsonFiles/lockdownStatus.json');


      switch (action) {

        case "start":
          if ( lockdownJSON["status"] === 1 ) {
            return await ErrorModule.LogToUser(message.channel, `You can't start a lockdown when there's already one in progress!`);
          }
          else {

            let lockdownReason = args.join(' ');

            // Attach Lockdown Role
            let j = 0;
            let addRoleInterval = client.setInterval(() => {
              allMembers[j].roles.add(lockdownRole);
              j++;

              if ( j >= allMembers.length ) {
                client.clearInterval(addRoleInterval);
              }
            }, 1000);


            // Send reason
            await lockdownInfoChannel.send(`\`\`\`LOCKDOWN START\`\`\`\n${lockdownReason}`);

            // Tweak Status
            lockdownJSON["status"] = 1;
            
            fs.writeFile("./hiddenJsonFiles/lockdownStatus.json", JSON.stringify(lockdownJSON, null, 4), (err) => {
              if (err) { console.error(err); }
            });

            return;

          }






          case "end":
            if ( lockdownJSON["status"] === 0 ) {
              return await ErrorModule.LogToUser(message.channel, `You can't stop a lockdown when there is no lockdowns running!`);
            }
            else {
  
              let lockdownReason = args.join(' ');
  
              // Revoke Lockdown Role
              let j = 0;
              let addRoleInterval = client.setInterval(() => {
                allMembers[j].roles.remove(lockdownRole);
                j++;
  
                if ( j >= allMembers.length ) {
                  client.clearInterval(addRoleInterval);
                }
              }, 1000);
  
  
              // Send reason
              await lockdownInfoChannel.send(`\`\`\`LOCKDOWN END\`\`\`\n${lockdownReason}`);
  
              // Tweak Status
              lockdownJSON["status"] = 0;

              fs.writeFile("./hiddenJsonFiles/lockdownStatus.json", JSON.stringify(lockdownJSON, null, 4), (err) => {
                if (err) { console.error(err); }
              });
  
              return;
  
            }



        default:
          return await ErrorModule.LogToUser(message.channel, `I was unable to perform that Lockdown action... :/`);

      }


      // END OF COMMAND
    },
};
