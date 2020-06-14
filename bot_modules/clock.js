const Discord = require("discord.js");
const { client } = require('./constants.js');

module.exports = {
    name: `clock`,
    description: `Automatically changes the Clock Channel every 5 minutes to the real-world time in the UK`,
    async execute() {
        
        // Fetch stuff
        let guild = client.guilds.resolve('681805468749922308');
        let ukClockChannel = guild.channels.resolve('721666177453129758');

        client.setInterval(async () => {

            // Fetch current time and update VC
            let timeNow = new Date();
            let ukHoursNow = parseInt(timeNow.getHours()) + 1;

            if ( ukHoursNow >= 24 ) {
                ukHoursNow = 0;
            }

            let ukTimeNow = ukHoursNow + `:` + timeNow.getMinutes() + ` BST`;

            await ukClockChannel.setName(ukTimeNow, `Automatic Clock Update`);

        }, 300000);

    }
};