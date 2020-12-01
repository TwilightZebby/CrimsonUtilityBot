// LIBRARIES
const fs = require('fs');
const Discord = require('discord.js');

// GLOBAL STUFF
const { client } = require('./constants.js');
const { PREFIX, TOKEN } = require('./config.js');

// MAPS AND COLLECTIONS
client.commands = new Discord.Collection();
client.modules = new Discord.Collection();
client.throttle = new Discord.Collection();
const cooldowns = new Discord.Collection();

// BRING IN COMMAND FILES
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // General Commands
const managementFiles = fs.readdirSync('./commands/management').filter(file => file.endsWith('.js')); // Management Commands
const moderationFiles = fs.readdirSync('./commands/moderation').filter(file => file.endsWith('.js')); // Moderation Commands

// ADD COMMAND FILES TO COLLECTION
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

for (const file of managementFiles) {
    const command = require(`./commands/management/${file}`);
    client.commands.set(command.name, command);
}

for (const file of moderationFiles) {
    const command = require(`./commands/moderation/${file}`);
    client.commands.set(command.name, command);
}

// BRING IN MODULES
const moduleFiles = fs.readdirSync('./bot_modules').filter(file => file.endsWith('.js'));

// ADD MODULE FILES TO COLLECTION
for (const file of moduleFiles) {
    const module = require(`./bot_modules/${file}`);
    client.modules.set(module.name, module);
}













/**
 * Throttle Responses to prevent hitting API Ratelimit
 * 
 * @param {Discord.TextChannel} channel 
 * @param {Discord.Message} message
 * @param {String} userID 
 * @param {Discord.MessageAttachment} [attachment]
 */
client.throttleCheck = async (channel, message, userID, attachment) => {

    if (!client.throttle.has(userID)) {
            
      let throttleTimeout = setTimeout(() => {
        client.throttle.delete(userID);
      }, 10000); // 10 seconds
    
      let userThrottle = {
        "messageCount": 1,
        "timeout": throttleTimeout
      };
    
      client.throttle.set(userID, userThrottle);
      if (message && !attachment) {
        await channel.send(message);
      }
      else {
        await channel.send(message, attachment);
      }
      
      
    }
    else {
    
      let userThrottleMap = client.throttle.get(userID);
      
      if (userThrottleMap["messageCount"] < 5) {
        userThrottleMap["messageCount"] += 1;
        
        if (message && !attachment) {
          await channel.send(message);
        }
        else if (!message && attachment) {
          await channel.send(attachment);
        }
        else {
          await channel.send(message, attachment);
        }
  
      }
      else if (userThrottleMap["messageCount"] >= 5) {
        // No responses, the User was throttled.            
    
        userThrottleMap["messageCount"] += 1;
      }
    
    }
  
    return;
  
};






















// DEBUGGING AND ERROR HANDLING
// Warnings
process.on('warning', async (warning) => {

    // Log to console
    console.warn(warning);
  
    // Log to error log channel
    let errorChannel = await client.guilds.fetch('681805468749922308');
    errorChannel = errorChannel.channels.resolve('726336306497454081');
  
    return await errorChannel.send(`\`\`\`Warning:\n
    ${warning}
    \`\`\``);
  
});
  
// Unhandled Promise Rejections
process.on('unhandledRejection', async (error) => {
  
    return await Errors.LogCustom(error, `Unhandled Promise Rejection:`)
  
});
  
  
 
  
  
// Discord Error Handling
client.on('error', async (error) => {
  
    return await Errors.LogCustom(error, `Discord Error:`);
  
});
  
  
// Discord RateLimit Errors
client.on('rateLimit', async (rateLimitInfo) => {
  
    // Log to Console
    console.warn(rateLimitInfo);
  
    // Log to error log channel
    let errorChannel = await client.guilds.fetch('681805468749922308');
    errorChannel = errorChannel.channels.resolve('726336306497454081');
  
    return await errorChannel.send(`\`\`\`Discord Ratelimit Error:\n
    Timeout (ms): ${rateLimitInfo.timeout}
    Limit: ${rateLimitInfo.limit}
    Method: ${rateLimitInfo.method}
    Path: ${rateLimitInfo.path}
    Route: ${rateLimitInfo.route}
    \`\`\``);
  
});
  
  
// Discord API Warnings
client.on('warn', async (warning) => {
  
    // Log to console
    console.warn(warning);
  
    // Log to error log channel
    let errorChannel = await client.guilds.fetch('681805468749922308');
    errorChannel = errorChannel.channels.resolve('726336306497454081');
  
    return await errorChannel.send(`\`\`\`Discord Warning:\n
    ${warning}
    \`\`\``);
  
});



































// DISCORD API READY EVENT
// - Bot Status
client.once('ready', async () => {

    await client.user.setPresence( { activity: { name: `peeps use ${PREFIX}help`, type: 'WATCHING' }, status: 'online' } );

    // To refresh the Status
    client.setInterval(async function(){
        await client.user.setPresence( { activity: { name: `peeps use ${PREFIX}help`, type: 'WATCHING' }, status: 'online' } );
    }, 1.08e+7);

    console.log("I am ready!");

});
