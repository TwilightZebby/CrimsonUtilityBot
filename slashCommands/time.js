// LIBRARY IMPORTS
const fs = require('fs');
const Discord = require("discord.js");

// MODULE IMPORTS
//const ErrorModule = require('../bot_modules/errorLogger.js');
const SlashCommands = require('../bot_modules/slashModule.js');

// VARIABLE IMPORTS
const { client } = require('../constants.js');
const { PREFIX } = require('../config.js');



// THIS COMMAND
module.exports = {
    name: 'time',
    description: 'Shows the current time in the UK. Can also compare between UK and other Timezones',

    // LIMITATIONS
    //     'twilightzebby' - Only TwilightZebby#1955 can use this command
    //     If commented out, everyone can use this command
    //limitation: 'twilightzebby',

    // Command's cooldown, in seconds
    cooldown: 60,

    /**
     * Command's functionality
     * 
     * @param {Discord.Guild} guild 
     * @param {*} data
     * @param {*} commandData
     * @param {Discord.GuildMember} member
     */
    async execute(guild, data, commandData, member) {

      const now = Date.now();

      const UKTimezone = Intl.DateTimeFormat('en-GB', {
        hour: 'numeric', minute: 'numeric', hour12: true,
        timeZone: 'Europe/London',
        timeZoneName: 'short'
      }).format(now);



      // If no options are given
      if ( !commandData.options ) {

        return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}`);

      }
      else {






        // Sourced from
        //     https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List

        let otherTimezone;

        switch (commandData.options[0].value) {

          case "CST":
            otherTimezone = Intl.DateTimeFormat('en-US', {
              hour: 'numeric', minute: 'numeric', hour12: true,
              timeZone: 'America/Chicago',
              timeZoneName: 'short'
            }).format(now);

            return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}.\nIn America/Chicago it is ${otherTimezone}`);




          case "EST":
            otherTimezone = Intl.DateTimeFormat('en-US', {
              hour: 'numeric', minute: 'numeric', hour12: true,
              timeZone: 'America/Toronto',
              timeZoneName: 'short'
            }).format(now);

            return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}.\nIn America/Toronto it is ${otherTimezone}`);




          case "PST":
            otherTimezone = Intl.DateTimeFormat('en-US', {
              hour: 'numeric', minute: 'numeric', hour12: true,
              timeZone: 'America/Los_Angeles',
              timeZoneName: 'short'
            }).format(now);

            return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}.\nIn America/Los_Angeles it is ${otherTimezone}`);




          case "CET":
            otherTimezone = Intl.DateTimeFormat('en-US', {
              hour: 'numeric', minute: 'numeric', hour12: true,
              timeZone: 'Europe/Paris',
              timeZoneName: 'short'
            }).format(now);

            return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}.\nIn Europe/Paris it is ${otherTimezone}`);




          case "MST":
            otherTimezone = Intl.DateTimeFormat('en-US', {
              hour: 'numeric', minute: 'numeric', hour12: true,
              timeZone: 'America/Phoenix',
              timeZoneName: 'short'
            }).format(now);

            return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}.\nIn America/Phoenix it is ${otherTimezone}`);




          case "MSK":
            otherTimezone = Intl.DateTimeFormat('en-US', {
              hour: 'numeric', minute: 'numeric', hour12: true,
              timeZone: 'Europe/Moscow',
              timeZoneName: 'short'
            }).format(now);

            return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}.\nIn Europe/Moscow it is ${otherTimezone}`);




          case "JST":
            otherTimezone = Intl.DateTimeFormat('en-US', {
              hour: 'numeric', minute: 'numeric', hour12: true,
              timeZone: 'Asia/Tokyo',
              timeZoneName: 'short'
            }).format(now);

            return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}.\nIn Asia/Tokyo it is ${otherTimezone}`);




          case "AEDT":
            otherTimezone = Intl.DateTimeFormat('en-US', {
              hour: 'numeric', minute: 'numeric', hour12: true,
              timeZone: 'Australia/Sydney',
              timeZoneName: 'short'
            }).format(now);

            return await SlashCommands.CallbackEphemeral(data, `${member.displayName}, The current time in the UK is ${UKTimezone}.\nIn Australia/Sydney it is ${otherTimezone}`);




          default:
            return await SlashCommands.CallbackEphemeral(data, `Sorry ${member.displayName} - either that wasn't a [valid timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List) or I don't support it yet!`);

        }

      }

      //END OF SLASH COMMAND
    },
















    /**
     * Registers the Slash Command
     * 
     * @param {Boolean} isGlobal True if Global, False if Guild
     * @param {String} [guildID] Provide Guild ID if Guild Command, otherwise ignore
     */
     async register(isGlobal, guildID) {
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

      if ( isGlobal ) {
        client.api.applications(client.user.id).commands().post({data});
      }
      else {
        client.api.applications(client.user.id).guilds(guildID).commands().post({data});
      }

      return;
    }
};
