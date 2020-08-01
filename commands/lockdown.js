let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const fs = require('fs');
const { client } = require('../bot_modules/constants.js');
let lockdownJSON = require('../bot_storage/lockdownStatus.json');

module.exports = {
    name: 'lockdown',
    description: 'Starts or Ends a Server Lockdown',
    usage: '<start|end> [reason]',
    //aliases: [''],
    args: true,
    ownerOnly: true,
    //hidden: true,
    commandType: 'management',
    async execute(message, args) {
      
      // Fetch stuff
      let action = args.shift().toString().toLowerCase();
      let lockdownRole = message.guild.roles.resolve('705044968552529960');
      let lockdownChatChannel = message.guild.channels.resolve('705046387796213791');
      let lockdownInfoChannel = message.guild.channels.resolve('705046342019580006');

      let allMembers = await message.guild.members.fetch();
      let allMembersArray = allMembers.array();
      allMembersArray = allMembersArray.filter(member => !member.user.bot);
      let reason = null;

      let now = new Date();


      // Check if there's a reason
      if ( args.length >= 1 ) {
        reason = args.join(' ');
      }



      switch(action) {

        // IF START
        case 'start':

          if (reason === null) {

            for( let i = 0; i < allMembersArray.length; i++ ) {
            
              await allMembersArray[i].roles.add(lockdownRole, "Lockdown Started");
  
            }

            let embed = new Discord.MessageEmbed().setColor('#9c0000')
            .setTitle(`Server Lockdown started`)
            .setTimestamp(now);

            await lockdownInfoChannel.send(embed);


            embed.setDescription(`*Something has happened and we are working on bringing things back to normal!*`);
            await lockdownChatChannel.send(embed);


            lockdownJSON["status"] = 1;

            fs.writeFile("./bot_storage/lockdownStatus.json", JSON.stringify(lockdownJSON, null, 4), (err) => {
              if(err) { console.log(err); } 
            });

            return;

          }
          else {

            for( let i = 0; i < allMembersArray.length; i++ ) {
            
              await allMembersArray[i].roles.add(lockdownRole, "Lockdown Started");
  
            }

            let embed = new Discord.MessageEmbed().setColor('#9c0000')
            .setTitle(`Server Lockdown started`)
            .setDescription(reason)
            .setTimestamp(now);

            await lockdownInfoChannel.send(embed);
            await lockdownChatChannel.send(embed);



            lockdownJSON["status"] = 1;

            fs.writeFile("./bot_storage/lockdownStatus.json", JSON.stringify(lockdownJSON, null, 4), (err) => {
              if(err) { console.log(err); } 
            });

            return;

          }
        

        
        
        
        
        // IF END
        case 'end':

          if (reason === null) {

            for( let i = 0; i < allMembersArray.length; i++ ) {
            
              await allMembersArray[i].roles.remove(lockdownRole, "Lockdown Ended");
  
            }

            let embed = new Discord.MessageEmbed().setColor('#00de04')
            .setTitle(`Server Lockdown ended`)
            .setTimestamp(now);

            await lockdownInfoChannel.send(embed);
            await lockdownChatChannel.send(embed);


            lockdownJSON["status"] = 0;

            fs.writeFile("./bot_storage/lockdownStatus.json", JSON.stringify(lockdownJSON, null, 4), (err) => {
              if(err) { console.log(err); } 
            });

            return;

          }
          else {

            for( let i = 0; i < allMembersArray.length; i++ ) {
            
              await allMembersArray[i].roles.remove(lockdownRole, "Lockdown Ended");
  
            }

            let embed = new Discord.MessageEmbed().setColor('#00de04')
            .setTitle(`Server Lockdown ended`)
            .setDescription(reason)
            .setTimestamp(now);

            await lockdownInfoChannel.send(embed);
            await lockdownChatChannel.send(embed);


            lockdownJSON["status"] = 0;

            fs.writeFile("./bot_storage/lockdownStatus.json", JSON.stringify(lockdownJSON, null, 4), (err) => {
              if(err) { console.log(err); } 
            });

            return;

          }






        // DEFAULT
        default:
          return await message.reply(`Sorry, but that wasn't \`start\` or \`end\` - please try again!`);
      }

      //END OF COMMAND
    },
};
