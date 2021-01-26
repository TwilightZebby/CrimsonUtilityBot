// LIBRARIES
const fs = require('fs');
const Discord = require('discord.js');



// GLOBAL STUFF
const { client } = require('./constants.js');
const { PREFIX, TOKEN } = require('./config.js');



// MAPS AND COLLECTIONS
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.throttle = new Discord.Collection();
client.cooldowns = new Discord.Collection();



// BRING IN COMMANDS
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const tempCMD = require(`./commands/${file}`);
    client.commands.set(tempCMD.name, tempCMD);
}

for (const file of slashCommandFiles) {
    const tempSlashCMD = require(`./slashCommands/${file}`);
    client.slashCommands.set(tempSlashCMD.name, tempSlashCMD);
}











/**
 * Throttle responses to prevent hitting API Ratelimit
 * 
 * @param {Discord.TextChannel} channel
 * @param {Discord.Message} message
 * @param {String} userID
 * @param {Discord.MessageAttachment} [attachment]
 * @param {Discord.MessageEmbed} [embed]
 */
client.throttleCheck = async (channel, message, userID, attachment, embed) => {

    if (!client.throttle.has(userID)) {
            
        let throttleTimeout = setTimeout(() => {
          client.throttle.delete(userID);
        }, 10000); // 10 seconds
      
        let userThrottle = {
          "messageCount": 1,
          "timeout": throttleTimeout
        };
      
        client.throttle.set(userID, userThrottle);
        if (message && !attachment && !embed) {
          await channel.send(message);
        }
        else if (message && attachment && !embed) {
          await channel.send(message, attachment);
        }
        else if (message && !attachment && embed) {
            await channel.send(message, embed)
        }
        
        
    }
    else {
      
        let userThrottleMap = client.throttle.get(userID);
        
        if (userThrottleMap["messageCount"] < 5) {
          userThrottleMap["messageCount"] += 1;
          
          if (message && !attachment && !embed) {
            await channel.send(message);
          }
          else if (message && attachment && !embed) {
            await channel.send(message, attachment);
          }
          else if (message && !attachment && embed) {
              await channel.send(message, embed)
          }
    
        }
        else if (userThrottleMap["messageCount"] >= 5) {
          // No responses, the User was throttled.            
      
          userThrottleMap["messageCount"] += 1;
        }
      
    }
    
    return;

};



























/**
 * @type {Discord.Guild}
 */
let SupportGuild;

/**
 * @type {Discord.TextChannel}
 */
let ErrorChannel;

// DISCORD READY EVENT
client.once('ready', async () => {

    SupportGuild = await client.guilds.fetch('681805468749922308');
    ErrorChannel = SupportGuild.channels.resolve('726336306497454081');

    await client.user.setPresence(
        {
            activity: {
                name: `my commands`,
                type: 'LISTENING'
            },
            status: 'online'
        }
    );


    // Refresh
    client.setInterval(async function(){
        await client.user.setPresence(
            {
                activity: {
                    name: `my commands`,
                    type: 'LISTENING'
                },
                status: 'online'
            }
        );
    }, 1.08e+7);

    console.log("I am ready!");

});





































// DEBUGGING AND ERROR LOGGING
const ErrorModule = require('./bot_modules/errorLogger.js');


// WARNINGS
process.on('warning', async (warning) => {

    // Log to console
    console.warn(warning);

    // Log to Discord
    return await ErrorChannel.send(`**WARNING:**
    \`\`\`
    ${warning}
    \`\`\``);

});


client.on('warn', async (warning) => {

    // Log to console
    console.warn(warning);

    // Log to Discord
    return await ErrorChannel.send(`**DISCORD WARNING:**
    \`\`\`
    ${warning}
    \`\`\``);

});






// Unhandled Promise Rejections
process.on('unhandledRejection', async (error) => {

    // Log to console
    console.error(error);

    // Log to Discord
    return await ErrorChannel.send(`**Unhandled Promise Rejection:**
    \`\`\`
    ${error}
    \`\`\`
    **STACK TRACE:**
    \`\`\`
    ${error.stack}
    \`\`\``);

});





// DISCORD ERRORS
client.on('error', async (error) => {

    // Log to console
    console.error(error);

    // Log to Discord
    return await ErrorChannel.send(`**DISCORD ERROR:**
    \`\`\`
    ${error}
    \`\`\`
    **STACK TRACE:**
    \`\`\`
    ${error.stack}
    \`\`\``);

});





// Discord Ratelimit Error
client.on('rateLimit', async (rateLimitInfo) => {

    // Log to console
    console.warn(rateLimitInfo);

    // Log to Discord
    return await ErrorChannel.send(`\`\`\`DISCORD RATELIMIT:
    Timeout: ${rateLimitInfo.timeout} ms
    Limit: ${rateLimitInfo.limit}
    Method: ${rateLimitInfo.method}
    Path: ${rateLimitInfo.path}
    Route: ${rateLimitInfo.route}
    \`\`\``);

});








































const ReactionRoleJSON = require('./hiddenJsonFiles/reactionRoles.json');
// NotifyRoles
const ReactionRoleMessageIDs = [ '708594329588858881', '803224102881591326' ];

// When a Reaction is added to a Message
client.on('messageReactionAdd', async (reaction, user) => {

    // Check for partials
    if ( reaction.partial ) {
        await reaction.fetch();
    }

    if ( reaction.message.partial ) {
        await reaction.message.fetch();
    }

    if ( user.partial ) {
        await user.fetch();
    }



    // Check message *is* a Self Assign Roles Menu
    let messageID = reaction.message.id;

    if ( !ReactionRoleMessageIDs.includes(messageID) ) {
        return;
    }



    // Self Assignable Role Menus
    let member = await SupportGuild.members.fetch(user.id);
    let emoji = reaction.emoji;
    let role = await SupportGuild.roles.fetch(ReactionRoleJSON[`${messageID}`]["emojis"][`${emoji.name}`]);

    return await member.roles.add(role, `Added via a Self-Assign menu`);

});





































// When a Reaction is removed from a Message
client.on('messageReactionRemove', async (reaction, user) => {

    // Check for partials
    if ( reaction.partial ) {
        await reaction.fetch();
    }

    if ( reaction.message.partial ) {
        await reaction.message.fetch();
    }

    if ( user.partial ) {
        await user.fetch();
    }



    // Check message *is* a Self Assign Roles Menu
    let messageID = reaction.message.id;

    if ( !ReactionRoleMessageIDs.includes(messageID) ) {
        return;
    }



    // Self Assignable Role Menus
    let member = await SupportGuild.members.fetch(user.id);
    let emoji = reaction.emoji;
    let role = await SupportGuild.roles.fetch(ReactionRoleJSON[`${messageID}`]["emojis"][`${emoji.name}`]);

    return await member.roles.remove(role, `Removed via a Self-Assign menu`);

});











































const VerifyModule = require('./bot_modules/verifyModule.js');
const JoinMessages = require('./jsonFiles/joinMessages.json');

// When a Member joins the Server
client.on('guildMemberAdd', async (member) => {

    if ( member.partial ) {
        await member.fetch().catch(err => { return console.error(err); });
    }

    // Catch non-User Accounts
    if ( member.user.bot ) { 
        let botGatewayRole = await SupportGuild.roles.fetch('802116975870083133', true);
        await member.roles.add(botGatewayRole);
        return;
    }

    if ( member.user.system ) { return; }


    const WelcomeChannel = SupportGuild.channels.resolve('681805469274341419');
    const SocialChannel = SupportGuild.channels.resolve('681806974916100097');

    
    // Fetch Member details
    await member.guild.members.fetch(); // Refresh cache
    let guildMemberTotal = Array.from(member.guild.members.cache.values()).filter(member => { return !member.user.bot; }).length;


    // Embed
    const embed = new Discord.MessageEmbed().setColor('#07f51b')
    .setTitle(`${member.user.username}#${member.user.discriminator} joined the server`)
    .setDescription(`${JoinMessages["messages"][Math.floor( ( Math.random() * JoinMessages["messages"].length ) + 0 )]}`)
    .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }))
    .setFooter(`Total Server Members: ${guildMemberTotal}`);

    await WelcomeChannel.send(embed);
    await SocialChannel.send(embed);

    delete embed; // free up cache


    // Gateway Channel
    let gatewayChannel = SupportGuild.channels.resolve('681806729389801472');
    let gatewayRole = await SupportGuild.roles.fetch('712224145064067112', true);

    await VerifyModule.OnJoin(member, gatewayChannel, gatewayRole);

    return;

});













































const LeaveMessages = require('./jsonFiles/leaveMessages.json');

// When a Member leaves the Server
client.on('guildMemberRemove', async (member) => {

    if ( member.partial ) {
        return;
    }



    // Catch non-User Accounts
    if ( member.user.bot || member.user.system ) { return; }


    const WelcomeChannel = SupportGuild.channels.resolve('681805469274341419');


    // Embed
    const embed = new Discord.MessageEmbed().setColor('#730000')
    .setTitle(`${member.user.username}#${member.user.discriminator} left`)
    .setDescription(`${LeaveMessages["messages"][Math.floor( ( Math.random() * LeaveMessages["messages"].length ) + 0 )]}`)
    .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true }));

    await WelcomeChannel.send(embed);

    delete embed; // free up cache

    return;

});





















































const SlashModule = require('./bot_modules/slashModule.js');


// Sneaky trick to use SLASH COMMANDS
client.on('raw', async (evt) => {

    if ( evt.t !== 'INTERACTION_CREATE' ) { return; }

    const {d: data} = evt;

    if ( data.type !== 2 ) { return; }

    const CommandData = data.data;
    const GuildMember = await SupportGuild.members.fetch(data.member.user.id);


    const fetchedSlashCommand = client.slashCommands.get(CommandData.name);

    if ( !fetchedSlashCommand ) {
        await SlashModule.CallbackEphemeral(data, 3, `Sorry ${GuildMember.displayName} - something prevented me from executing the **${CommandData.name}** command...`);
        return;
    }
    else {












        // COMMAND COOLDOWNS
        if ( !client.cooldowns.has(fetchedSlashCommand.name) ) {
            client.cooldowns.set(fetchedSlashCommand.name, new Discord.Collection());
        }


        const now = Date.now();
        const timestamps = client.cooldowns.get(fetchedSlashCommand.name);
        const cooldownAmount = (fetchedSlashCommand.cooldown || 3) * 1000;


        if ( timestamps.has(GuildMember.user.id) ) {

            if ( GuildMember.user.id === "156482326887530498" ) {
                timestamps.delete(GuildMember.user.id);
            }
            else {

                const expirationTime = timestamps.get(GuildMember.user.id) + cooldownAmount;

                if ( now < expirationTime ) {

                    let timeLeft = (expirationTime - now) / 1000;
                    
                    // Minutes
                    if ( timeLeft >= 60 && timeLeft < 3600 ) {
                        timeLeft /= 60;
                        return await SlashModule.CallbackEphemeral(data, 3, `${GuildMember.displayName} - Please wait ${timeLeft.toFixed(1)} more minutes before using the \`${fetchedSlashCommand.name}\` command`);
                    }
                    // Hours
                    else if ( timeLeft >= 3600 ) {
                        timeLeft /= 3600;
                        return await SlashModule.CallbackEphemeral(data, 3, `${GuildMember.displayName} - Please wait ${timeLeft.toFixed(1)} more hours before using the \`${fetchedSlashCommand.name}\` command`);
                    }
                    // Seconds
                    else {
                        return await SlashModule.CallbackEphemeral(data, 3, `${GuildMember.displayName} - Please wait ${timeLeft.toFixed(1)} more seconds before using the \`${fetchedSlashCommand.name}\` command`);
                    }

                }

            }

        }
        else if ( GuildMember.user.id === "156482326887530498" ) {
            // Developer override!
        }
        else {
            timestamps.set(GuildMember.user.id, now);
            setTimeout(() => timestamps.delete(GuildMember.user.id), cooldownAmount);
        }







        // execute slash commmand
        try {
            await fetchedSlashCommand.execute(SupportGuild, data, CommandData, GuildMember);
        } catch (err) {
            await ErrorModule.LogCustom(err, `(**INDEX.JS** - Execute __slash__ command fail)`);
            await SlashModule.CallbackEphemeral(data, 3, `Sorry ${GuildMember.displayName} - there was an error trying to run that command...`);
        }


        return;
    }

});














































// DISCORD MESSAGE POSTED EVENT
// - Commands (not Slash versions)
client.on('message', async (message) => {

    // Prevent Discord Outages crashing the Bot
    if ( !message.guild.available ) { return; }


    if ( message.partial ) {
        await message.fetch();
    }


    // If Message was sent in DMs
    if ( message.channel instanceof Discord.DMChannel ) {

        // TODO: DM Message Logger

    }









    // Prevent other Bots/System stuff triggering us
    if ( message.author.bot || message.author.flags.has('SYSTEM') || message.system ) { return; }



    // Prefix Check
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);


    if ( !prefixRegex.test(message.content) ) {
        // No PREFIX found, do nothing
        return;
    }
    else {

        // Slice PREFIX and fetch Command
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);


        if ( !command ) {
            // No command found, do nothing
            return;
        }



        // COMMAND LIMITATIONS
        if ( command.limitation ) {
            switch(command.limitation) {

                case "twilightzebby":
                    if ( message.author.id !== "156482326887530498" ) {
                        return await client.throttleCheck(message.channel, `${message.member.displayName} sorry, but this command is limited to just TwilightZebby#1955`, message.author.id);
                    }
                    break;



                default:
                    break;

            }
        }








        // COMMAND COOLDOWNS
        if ( !client.cooldowns.has(command.name) ) {
            client.cooldowns.set(command.name, new Discord.Collection());
        }


        const now = Date.now();
        const timestamps = client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;


        if ( timestamps.has(message.author.id) ) {

            if ( message.author.id === "156482326887530498" ) {
                timestamps.delete(message.author.id);
            }
            else {

                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if ( now < expirationTime ) {

                    let timeLeft = (expirationTime - now) / 1000;
                    
                    // Minutes
                    if ( timeLeft >= 60 && timeLeft < 3600 ) {
                        timeLeft /= 60;
                        return await client.throttleCheck(message.channel, `${message.member.displayName} Please wait ${timeLeft.toFixed(1)} more minutes before using the \`${command.name}\` command`, message.author.id);
                    }
                    // Hours
                    else if ( timeLeft >= 3600 ) {
                        timeLeft /= 3600;
                        return await client.throttleCheck(message.channel, `${message.member.displayName} Please wait ${timeLeft.toFixed(1)} more hours before using the \`${command.name}\` command`, message.author.id);
                    }
                    // Seconds
                    else {
                        return await client.throttleCheck(message.channel, `${message.member.displayName} Please wait ${timeLeft.toFixed(1)} more seconds before using the \`${command.name}\` command`, message.author.id);
                    }

                }

            }

        }
        else if ( message.author.id === "156482326887530498" ) {
            // Developer override!
        }
        else {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

















        // EXECUTE COMMAND
        try {
            await command.execute(message, args);
        } catch (err) {
            await ErrorModule.LogCustom(err, `(**INDEX.JS** - Execute command fail)`);
            return await client.throttleCheck(message.channel, `Sorry ${message.member.displayName} - there was an error trying to run that command...`, message.author.id);
        }
    }

});





client.login(TOKEN);
