// Creating the variables needed
const fs = require('fs'); // Node's native file system
const Discord = require("discord.js"); // Bringing in Discord.js
const { client } = require('./bot_modules/constants.js'); // Brings in the Discord Bot's Client
let { PREFIX, TOKEN } = require('./config.js'); // Slapping the PREFIX and token into their own vars

client.commands = new Discord.Collection(); // Extends JS's native map class

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Picks up all the .js files in the commands folder
const suggestionFiles = fs.readdirSync('./commands/suggestion').filter(file => file.endsWith('.js')); // Picks up Suggestion Module Commands
const ticketFiles = fs.readdirSync('./commands/ticket').filter(file => file.endsWith('.js')); // Picks up Ticket Module Commands

const cooldowns = new Discord.Collection(); // For Cooldowns to work



// GENERAL COMMANDS
for (const file of commandFiles) { // Slaps all the command files into the Collection
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}


// SUGGESTION COMMANDS
for (const file of suggestionFiles) {
  const command = require(`./commands/suggestion/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}


// TICKET COMMANDS
for (const file of ticketFiles) {
  const command = require(`./commands/ticket/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}




// To make sure the bot is up and running
client.once("ready", async () => {

  client.user.setPresence({ activity: { name: `${PREFIX}help` }, status: 'online' });

  client.setInterval(function(){
    client.user.setPresence({ activity: { name: `${PREFIX}help` }, status: 'online' });
  }, 1.08e+7);


  console.log("I am ready!");








  // For the server's Stats Channels
  // Should refresh once every hour to prevent API rate-limiting

  // Fetch Channels
  let memberCountChannel = client.channels.resolve('705826480306913281');
  let botCountChannel = client.channels.resolve('705826767679651842');
  let roleCountChannel = client.channels.resolve('705826598166855701');
  let channelCountChannel = client.channels.resolve('705826700927434884');

  // Fetch Guild & CrimsonRoulette Bot
  let guildObj = client.guilds.resolve('681805468749922308');

  client.setInterval(() => {

    // Fetch stats

    // Member Count WITHOUT BOTS
    let memberTotal = Array.from(guildObj.members.cache.values()).filter(member => { return !member.user.bot; }).length;
    let botTotal = Array.from(guildObj.members.cache.values()).filter(member => { return member.user.bot; }).length;
    let roleTotal = Array.from(guildObj.roles.cache.values()).length;

    let channelTotal = Array.from(guildObj.channels.cache.values()).filter(channel => { 
      let temp = true;
      if (channel.type === 'category') {
        temp = false;
      } else {
        temp = true;
      }
      return temp;
    }).length;

    
    // Update Channel Names to reflect fetched values
    memberCountChannel.setName(`Member Count: ${memberTotal}`);
    botCountChannel.setName(`Bot Count: ${botTotal}`);
    roleCountChannel.setName(`Role Count: ${roleTotal}`);
    channelCountChannel.setName(`Channel Count: ${channelTotal}`);


  }, 3.6e+6);


});



// Debugging
process.on('warning', console.warn);
// Extra Error Catching
process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));
















/***********************************************/
// WHEN A NEW MEMBER JOINS A GUILD
//     - Welcome messages
//     - Verification


// Randomiseable parts of message
const welcomeTitles = [
  'Hark! A new User joined!',
  'A new User joined. Let\'s deal them in...',
  'LET\'S GET READY TO RUMBLEEEEEEE!',
  'The stars have aligned for this moment...',
  'A new User joined the server!',
  'A new Peep joined the server!',
  'Hey look, the pizza has arrived!',
  'A new challenger approaches!'
];



client.on('guildMemberAdd', async (member) => {

  if ( member.user.bot === true ) {
    return;
  }

  
  // Fetch Channel
  let welcomeChannel = member.guild.channels.resolve('681805469274341419');


  // Fetch Details
  let userAvatar = member.user.displayAvatarURL();
  let guildMemberTotal = member.guild.memberCount;
  let antiBotTotal = Array.from(member.guild.members.cache.values()).filter(member => { return !member.user.bot; }).length;


  // Display message
  const welcomeEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Greetings Module');
  
  let randomTitle = welcomeTitles[Math.floor((Math.random() * welcomeTitles.length) + 0)];

  welcomeEmbed.setTitle(randomTitle);
  welcomeEmbed.setDescription(`Welcome ${member} to the Crimson Roulette Bot's official Server!`);
  welcomeEmbed.setThumbnail(userAvatar);
  welcomeEmbed.setFooter(`Total Server Members: ${guildMemberTotal} • Total Members without Bots: ${antiBotTotal}`);

  welcomeChannel.send(welcomeEmbed);

  
  let verifyChannel = member.guild.channels.resolve('681806729389801472');


  // Lock channel for User to prevent early access in case something breaks
  await verifyChannel.createOverwrite(member, {
    SEND_MESSAGES: false,
  }, "New Member, lock channel for them for 10 minutes")
  .catch(console.error);


  // Give them "Need Verification" Role
  let verifyRole = member.guild.roles.resolve('712224145064067112');
  await member.roles.add(verifyRole);


  // Push a reminder for the new User to use the verification command
  // (after 10 minutes)

  client.setTimeout(async () => {

    verifyChannel.permissionOverwrites.get(member.id).delete();

    await verifyChannel.send(`Hey there ${member}! This is just a friendly reminder to verify yourself so you can gain access to the rest of this Server!`);

  }, 600000);
  

  // End of guildMemberAdd Event
});

















/***********************************************/
// WHEN A MEMBER LEAVES A GUILD
//     - Leaving messages


// Randomiseable parts of message
const leavingTitles = [
  'Hark! A User left!',
  'A User left. Let\'s loot their items!',
  'Someone did not want to rumble...',
  'The stars have aligned for this moment... But they\'re the wrong stars',
  'A User just left'
];


client.on('guildMemberRemove', async (member) => {

  if ( member.user.bot === true ) {
    return;
  }

  // Fetch Channel
  let leavingChannel = member.guild.channels.resolve('681805469274341419');

  // Fetch User Details
  let memberName = member.displayName;
  let memberAvatar = member.user.displayAvatarURL();


  // Display message
  const leavingEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('Greetings Module');
  
  let randomTitle = leavingTitles[Math.floor((Math.random() * leavingTitles.length) + 0)];

  leavingEmbed.setTitle(randomTitle);
  leavingEmbed.setDescription(`${memberName} just left. ;-;`);
  leavingEmbed.setThumbnail(memberAvatar);

  leavingChannel.send(leavingEmbed);

  // End of guildMemberRemove Event
});































/***********************************************/
// THE COMMANDS
// Runs whenever a message is sent in a command the Bot has access to

client.on("message", async (message) => {

  // Prevent DM Usage ;P
  if ( message.channel.type === 'dm' ) {
    
    // Log all messages sent to the Bot's DMs as a just in case thing
    const dmLogEmbed = new Discord.MessageEmbed().setColor('#07f51b').setFooter('DM Logs');
    let logChannel = client.guilds.resolve('681805468749922308').channels.resolve('712595019210555442');
    let noMsgArray = [' ', undefined, null];



    // Basic Embed Details
    dmLogEmbed.setTitle(`DM from ${message.author.username}\#${message.author.discriminator}`)
    .setThumbnail(message.author.displayAvatarURL());



    // Check for attachments
    let msgAttachments = Array.from(message.attachments.values());
    if ( !msgAttachments.length ) {

      // No Attachments, just output message
      dmLogEmbed.setDescription(message.content);
      return await logChannel.send(dmLogEmbed);

    }
    else if ( msgAttachments.length >= 1 && !noMsgArray.includes(message.content) ) {

      // Yes Attachments and yes Message Content
      dmLogEmbed.setDescription(message.content)
      .setImage(msgAttachments[0].url);
      return await logChannel.send(dmLogEmbed);

    } else if ( msgAttachments.length >= 1 && noMsgArray.includes(message.content) ) {

      // Yes Attachments but no message content
      dmLogEmbed.setImage(msgAttachments[0].url);
      return await logChannel.send(dmLogEmbed);

    }

  }










  // If the msg it was sent by the bot itself - STOP
  if ( message.author.bot ) {
		return;
  }










  let botMember = message.guild.members.resolve('657859837023092746');

  let readMsg = botMember.hasPermission('VIEW_CHANNEL', { checkAdmin: true });
  let sendMsg = botMember.hasPermission('SEND_MESSAGES', { checkAdmin: true });

  if ( readMsg === false || sendMsg === false ) {
    let guildOwner = message.guild.owner;
    let goDM = await guildOwner.createDM();
    goDM.send(`Buzz! It would seem I don't have **Read Messages**, **View Channels**, and/or the **Send Messages** permission in *${message.guild.name}*!\nI'd be a pretty useless Bot without those permissions!`);
  }


  // PREFIX CHECK
  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);

  
  // If there is NO PREFIX, do the Levelling Stuff
  if ( !prefixRegex.test(message.content) ) {
    return;
  }

























  if ( prefixRegex.test(message.content) ) {

    // COMMANDS

    // Slides the PREFIX off the command
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    // Slaps the cmd into its own var
    const commandName = args.shift().toLowerCase();
    // If there is NOT a command with the given name or aliases, exit early
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    
    
    
    
    // COOLDOWNS
    // If a command has 'cooldown: x,' it will enable cooldown IN SECONDS
    if (!cooldowns.has(command.name)) {
       cooldowns.set(command.name, new Discord.Collection());
     }
   
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
   
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    
      if (now < expirationTime) {
        let timeLeft = (expirationTime - now) / 1000;
      
        // If greater than 60 Seconds, convert into Minutes
        if ( timeLeft > 60 && timeLeft < 3600 ) {
          timeLeft = timeLeft / 60;
          return message.reply(`Please wait ${timeLeft.toFixed(1)} more minute(s) before reusing the \`${command.name}\` command.`);
        }
        // If greater than 3600 Seconds, convert into Hours
        else if ( timeLeft > 3600 ) {
          timeLeft = timeLeft / 3600;
          return message.reply(`Please wait ${timeLeft.toFixed(1)} more hour(s) before reusing the \`${command.name}\` command.`);
        }
      
        return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      }
     } else {
       timestamps.set(message.author.id, now);
       setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
     }
   
   
   
   
   
   
    // A check for if the user ran a command inside DMs
    // if a cmd has 'guildOnly: true,', it won't work in DMs
    if (command.guildOnly && message.channel.type !== 'text') {
      return message.reply('I can\'t execute that command inside DMs!');
    }
  
    // A check for if the user ran a command inside Guilds
    // if a cmd has 'dmOnly: true,', it won't work in Guilds
    if (command.dmOnly && message.channel.type !== 'dm') {
      return message.reply('I can\'t execute that command inside Guilds!')
    }
  
    // A check for missing parameters
    // If a cmd has 'args: true,', it will throw the error
    // Requires the cmd file to have 'usage: '<user> <role>',' or similar
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
          reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }



    // Check if the command is Owner-only
    // (looks for 'ownerOnly: true')
    if ( command.ownerOnly && message.author.id !== '156482326887530498' ) {
      return message.reply(`Sorry, but that command can only be used by TwilightZebby himself.`);
    }
    
  
  
  
  
    
  
    // Check for permissions needed!
    let embedLinks = botMember.hasPermission('EMBED_LINKS', { checkAdmin: true });
    let attachFiles = botMember.hasPermission('ATTACH_FILES', { checkAdmin: true });

    if ( embedLinks === false && command.name !== 'ping' ) {
      return message.reply(`Sorry, but it would seem I don't have the Embed Links permission. I need that for my Embeds!`);
    }
    if ( attachFiles === false ) {
      return message.reply(`Sorry, but it would seem I don't have the Attach Files permission.`);
    }
  
  
  
  
  
    
  
    // If there is, grab and run that command's execute() function
    try {
      command.execute(message, args);
    } // Any errors are caught here, and thrown back at the User and Console
    catch (error) {
      console.error(error);
      message.reply('There was an error trying to execute that command!');
    }

  }

  

  /******************************************************/

});

/***********************************************/
// The token to connect the bot to the Bot Account on Discord
client.login(TOKEN);
