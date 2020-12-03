// LIBRARY IMPORTS
const Discord = require('discord.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');

// MODULE IMPORTS, IF ANY
//const Errors = client.modules.get("errorLogger");

// THIS MODULE
module.exports = {
    name: "help",

    /**
     * List all commands a standard User can use
     * 
     * @param {Discord.Message} message 
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ListCommands(message) {

        // Create Embed
        const embed = new Discord.MessageEmbed().setColor('#008bb5')
        .setTitle(`Command List`)
        .addFields(
            {
                name: `General Commands`,
                value: client.commands.filter(command => command.commandType === "general" && !command.limitation).map(command => command.name).join(`, `)
            },
            /*{
                name: `Feedback Commands`,
                value: client.commands.filter(command => command.commandType === "feedback" && !command.limitation).map(command => command.name).join(`, `)
            },*/
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );

        await client.throttleCheck(message.channel, embed, message.author.id);
        delete embed; // Free up cache
        return;

    },





























    /**
     * List all commands TwilightZebby, the Bot's Developer and Server Owner, and use
     * 
     * @param {Discord.Message} message
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async ListOwnerCommands(message) {

        // Create Embed
        const embed = new Discord.MessageEmbed().setColor('#008bb5')
        .setTitle(`Server Owner's Command List`)
        .addFields(
            {
                name: `General Commands`,
                value: client.commands.filter(command => command.commandType === "general").map(command => command.name).join(`, `)
            },
            /*{
                name: `Feedback Commands`,
                value: client.commands.filter(command => command.commandType === "feedback").map(command => command.name).join(`, `)
            },
            {
                name: `Moderation Commands`,
                value: client.commands.filter(command => command.commandType === "moderation").map(command => command.name).join(`, `)
            },
            {
                name: `Management Commands`,
                value: client.commands.filter(command => command.commandType === "management").map(command => command.name).join(`, `)
            },*/
            {
                name: `\u200B`,
                value: `You can use \`${PREFIX}help [command]\` to get more information on a specific command!`
            }
        );

        await client.throttleCheck(message.channel, embed, message.author.id);
        delete embed; // Free up cache
        return;

    },
    




























    /**
     * Search for an existing command and return it
     * 
     * @param {String} name The name, or aliases, of the command
     * 
     * @returns {Promise<Object>} The Command
     */
    async CommandSearch(name) {

        // Attempt fetching of command via name
        let result = client.commands.get(name);

        if (!result) {

            // Command wasn't found by name, check aliases instead
            for ( let [key, value] of client.commands ) {

                if ( !value.aliases || value.aliases === undefined ) {
                    continue;
                }
                
                if ( value.aliases.includes(name) ) {
                    return client.commands.get(key);
                }

            }

        }
        else {
            return result;
        }

    },
        




























    /**
     * Returns details of the given command
     * 
     * @param {Discord.Message} message
     * @param {String} name Command Name or alias
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async CommandHelp(message, name) {

        // Search for command
        const command = await this.CommandSearch(name);

        if (!command) {
            // NO COMMAND FOUND
            let response = `${message.member.displayName} sorry, but I could not find a command with the name/alias of **${name}**.\nYou can use \`${PREFIX}help\` to see a list of my commands though!`;
            return await client.throttleCheck(message.channel, response, message.author.id);
        }
        else {

            // If Command has a Limitation, prevent help from appearing for it if User doesn't match it
            if ( command.limitation ) {

                switch( command.limitation ) {

                    case "owner":
                        if ( message.author.id !== '156482326887530498' ) {
                            let response = `${message.member.displayName} sorry, but the **${command.name}** command is limited to TwilightZebby#1955, as such is hidden from you.`;
                            return await client.throttleCheck(message.channel, response, message.author.id);
                        }



                    default:
                        break;

                }

            }









            // Command Help Details
            const embed = new Discord.MessageEmbed().setColor('#008bb5')
            .setTitle(`${command.name} command`);


            // ALIASES
            if ( command.aliases ) {
                embed.addFields({
                    name: `Alias(es)`,
                    value: `\u200B ${command.aliases.join(', ')}`
                });
            }



            // DESCRIPTION
            if ( command.description ) {
                embed.addFields({
                    name: `Description`,
                    value: `\u200B ${command.description}`
                });
            }



            // USAGE
            if ( command.usage ) {
                embed.addFields({
                    name: `Usage(s)`,
                    value: `\u200B ${command.usage.join(`\n`)}`
                });
            }



            // COOLDOWN
            if ( command.cooldown ) {
                embed.addFields({
                    name: `Cooldown`,
                    value: `\u200B ${command.cooldown} seconds`
                });
            }



            // LIMITATION
            if ( command.limitation ) {

                switch(command.limitation) {

                    case "owner":
                        embed.addFields({
                            name: `Limitation`,
                            value: `\u200B Can only be used by TwilightZebby#1955, the Server Owner`
                        });




                    default:
                        break;

                }

            }



            // FLAGS
            if ( command.flags ) {

                let flagNames = [];
                let flagDescriptions = [];

                for ( let i = 0; i < command.flags.length; i++ ) {
                    flagNames.push(command.flags[i][0]);
                    flagDescriptions.push(command.flags[i][1]);
                }

                embed.addFields(
                    {
                        name: `Flag(s)`,
                        value: `\u200B ${flagNames.join(`\n`)}`,
                        inline: true
                    },
                    {
                        name: `Flag Behaviour`,
                        value: `\u200B ${flagDescriptions.join(`\n`)}`,
                        inline: true
                    }
                );

            }



            // SEND
            await client.throttleCheck(message.channel, embed, message.author.id);
            delete embed; // Clear Cache
            return;

        }

    }

};