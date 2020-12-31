/********************
 * Discord.js related
 ********************/

const Discord = require("discord.js"); //Bringing in Discord.js
exports.client = new Discord.Client(
    {
        partials: [ 'GUILD_MEMBER' ],
        ws: {
            intents: 32511
        }
    }
);
