// LIBRARY IMPORTS
const Discord = require('discord.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');


/*
 * type list:
 * 1 = SubCommand
 * 2 = SubCommandGroup
 * 3 = String
 * 4 = Integer
 * 5 = Boolean
 * 6 = User
 * 7 = Channel
 * 8 = Role
*/

// THIS MODULE
module.exports = {

    /**
     * Registers the Ping Slash Command
     * 
     * @param {Discord.Guild} guild 
     */
    async RegisterPing(guild) {

        // Data
        const data = {};
        data.name = "ping";
        data.description = "Test if the Bot responds";

        client.api.applications(client.user.id).guilds(guild.id).commands().post({data});

    },




















    /**
     * Registers the Slash Commands within Discord's Slash Command API
     * 
     * @param {Discord.Guild} guild 
     * @param {String} [command]
     */
    async RegisterCommands(guild, command) {

        if ( command ) {

            // specific command was given, register just that one
            switch (command) {

                case "ping":
                    return await this.RegisterPing(guild);



                default:
                    break;

            }

        }
        else {

            // Register all
            await this.RegisterPing(guild);

        }


        return;

    },











    /**
     * Removes the Slash Commands from the Slash Command API when we don't need them in the Guild anymore
     * 
     * @param {Discord.Guild} guild 
     * @param {String} [command]
     */
    async DeleteCommands(guild, command) {

        let cachedCommands = await client.api.applications(client.user.id).guilds(guild.id).commands().get();


        if ( command ) {

            // Just a specific command
            let temp = cachedCommands.find(element => element.name === command);
            client.api.applications(client.user.id).guilds(guild.id).commands(temp.id).delete();

        }
        else {

            // Go through and remove all the commands
            for (let i = 0; i < cachedCommands.length; i++) {
                client.api.applications(client.user.id).guilds(guild.id).commands(cachedCommands[i].id).delete();
            }

        }

        return;

    },

















    /**
     * Responds to a Slash Command Interaction
     * 
     * @param {*} eventData
     * @param {String} message
     * @param {Discord.MessageEmbed} [embed]
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async Callback(eventData, message, embed) {

        const data = {
            "type": "4",
            "data": {
                "tts": false,
                "content": message,
                "embeds": embed === undefined ? [] : [embed],
                "allowed_mentions": []
            }
        };

        client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    }

};
