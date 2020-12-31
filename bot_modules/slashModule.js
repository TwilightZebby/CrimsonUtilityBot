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
     * Registers the Time Slash Command
     * 
     * @param {Discord.Guild} guild 
     */
    async RegisterTime(guild) {

        // Data
        const data = {};
        data.name = "time";
        data.description = "Shows the current time in the UK";
        data.options = new Array();


        // Options
        const option = {};

        option.name = "timezone";
        option.description = "Specify a Timezone to compare";
        option.type = 3; // String
        option.required = false;
        option.choices = [
            {
                "value": "CST",
                "name": "CST"
            },
            {
                "value": "EST",
                "name": "EST"
            },
            {
                "value": "PST",
                "name": "PST"
            },
            {
                "value": "CET",
                "name": "CET"
            },
            {
                "value": "MST",
                "name": "MST"
            },
            {
                "value": "MSK",
                "name": "MSK"
            },
            {
                "value": "JST",
                "name": "JST"
            },
            {
                "value": "AEDT",
                "name": "AEDT"
            }
        ];

        data.options.push(option);

        client.api.applications(client.user.id).guilds(guild.id).commands().post({data});

    },



























    /**
     * Registers the Feedback Slash Command
     * 
     * @param {Discord.Guild} guild 
     */
    async RegisterFeedback(guild) {

        // Data
        const data = {};
        data.name = "feedback";
        data.description = "Give feedback regarding the Crimson Levels Bot";
        data.options = new Array();


        // Options
        const option = {};

        option.name = "message";
        option.description = "Your feedback";
        option.type = 3; // String
        option.required = true;

        data.options.push(option);

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



                case "time":
                    return await this.RegisterTime(guild);



                case "feedback":
                    return await this.RegisterFeedback(guild);



                default:
                    break;

            }

        }
        else {

            // Register all
            await this.RegisterPing(guild);
            await this.RegisterTime(guild);
            await this.RegisterFeedback(guild);

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
     * @param {Number} type Response Type. 3 = w/ MSG Eat Input; 4 = w/ MSG show Input; 5 = w/out MSG show Input
     * @param {String} [message]
     * @param {Discord.MessageEmbed} [embed]
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async Callback(eventData, type, message, embed) {
        /* 
        * RESPONSE TYPES
        * 1 = Pong                        = ACK a ping
        * 2 = ACK                         = ACK a command without sending a message, eating the Input
        * 3 = ChannelMessage              = ACK a command, respond with a message, eat Input
        * 4 = ChannelMessageWithSource    = ACK a command, respond with a message, show Input
        * 5 = ACKWithSource               = ACK a command without sending message, show Input
        */

        
        let data;

        if ( message == undefined ) {

            data = {
                "type": `${type}`
            };

        }
        else {

            data = {
                "type": `${type}`,
                "data": {
                    "tts": false,
                    "content": message,
                    "embeds": embed == undefined ? [] : [embed],
                    "allowed_mentions": []
                }
            };

        }


        return client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    },



































    /**
     * Responds to a Slash Command Interaction using Ephemeral Messages (only the User can see)
     * 
     * @param {*} eventData
     * @param {Number} type Response Type. 3 = w/ MSG Eat Input; 4 = w/ MSG show Input; 5 = w/out MSG show Input
     * @param {String} message
     * 
     * @returns {Promise<Discord.Message>} wrapped Message
     */
    async CallbackEphemeral(eventData, type, message) {
        /* 
        * RESPONSE TYPES
        * 1 = Pong                        = ACK a ping
        * 2 = ACK                         = ACK a command without sending a message, eating the Input
        * 3 = ChannelMessage              = ACK a command, respond with a message, eat Input
        * 4 = ChannelMessageWithSource    = ACK a command, respond with a message, show Input
        * 5 = ACKWithSource               = ACK a command without sending message, show Input
        */


        let data = {
            "type": `${type}`,
            "data": {
                "tts": false,
                "content": message,
                "embeds": [],
                "allowed_mentions": [],
                "flags": 64
            }
        };


        return client.api.interactions(eventData.id)[eventData.token].callback().post({data});

    }

};
