let { PREFIX } = require('../config.js');
const Discord = require("discord.js");

// RULES
// For quick and easy use in /commands/rule.js
const ruleEmbed = new Discord.MessageEmbed().setColor('#000000');

module.exports = {
    ruleOne() {

        ruleEmbed.setTitle(`Rule 1`)
        .setDescription(`Please follow Discord's own Terms of Service (ToS) and Guidelines.
        ToS: [https://discord.com/terms](https://discord.com/terms)
        Guidelines: [https://discord.com/guidelines](https://discord.com/guidelines)`)
        .setFooter(`${PREFIX}rule 1`);

        return ruleEmbed;

    },

    ruleTwo() {

        ruleEmbed.setTitle(`Rule 2`)
        .setDescription(`Please don't discuss stuff people may take offense to (eg: politics, religion, etc)
        Additionally, please don't use names that describe a group of people as insults (ie: "furry", "gay", etc).
        I really don't want to see this, and they're actually pretty decent people if you get to know them....`)
        .setFooter(`${PREFIX}rule 2`);

        return ruleEmbed;

    },

    ruleThree() {

        ruleEmbed.setTitle(`Rule 3`)
        .setDescription(`Please don't talk about, or share any media (images/videos/GIFs/etc), that is of NSFW nature.
        We are a PG (or PG-13) Server and we don't have any NSFW channels for a reason
        This includes: scat, gore, vore, etc. (Don't google them, *please* - they're NSFW for a reason!)`)
        .setFooter(`${PREFIX}rule 3`);

        return ruleEmbed;

    },

    ruleFour() {

        ruleEmbed.setTitle(`Rule 4`)
        .setDescription(`Please don't spam in any of the channels.
        This includes emoji, GIF, image, video, etc spam`)
        .setFooter(`${PREFIX}rule 4`);

        return ruleEmbed;

    },

    ruleFive() {

        ruleEmbed.setTitle(`Rule 5`)
        .setDescription(`Don't @ping people or roles without reason.
        Spam @pinging also falls under RULE 4 - don't do it`)
        .setFooter(`${PREFIX}rule 5`);

        return ruleEmbed;

    },

    ruleSix() {

        ruleEmbed.setTitle(`Rule 6`)
        .setDescription(`Don't impersonate Users, people, or Bots.`)
        .setFooter(`${PREFIX}rule 6`);

        return ruleEmbed;

    },

    ruleSeven() {

        ruleEmbed.setTitle(`Rule 7`)
        .setDescription(`Don't complain when you receive a ping FROM ME in any of the announcement/update/status channels.
        I use an opt-in pinging system for a reason
        Additionally, don't complain when you get pinged by my Bot in the <#690834398513201152> channel. Mute it if you don't want the notifications!`)
        .setFooter(`${PREFIX}rule 7`);

        return ruleEmbed;

    },

    ruleEight() {

        ruleEmbed.setTitle(`Rule 8`)
        .setDescription(`Don't cause drama.
        We don't like toxicity - we have too much of that in the real world as is, please leave it outside this server`)
        .setFooter(`${PREFIX}rule 8`);

        return ruleEmbed;

    },

    ruleNine() {

        ruleEmbed.setTitle(`Rule 9`)
        .setDescription(`Respect all Users`)
        .setFooter(`${PREFIX}rule 9`);

        return ruleEmbed;

    },

    ruleTen() {

        ruleEmbed.setTitle(`Rule 10`)
        .setDescription(`Please try to keep the chats in English, so that we can better understand each other.`)
        .setFooter(`${PREFIX}rule 10`);

        return ruleEmbed;

    },

    ruleEleven() {

        ruleEmbed.setTitle(`Rule 11`)
        .setDescription(`Don't advertise *anything*
        No one likes an attention seeker.
        (Exemptions include me. If I decide to start allowing more exemptions, I will notify y'all in <#693365515552292895>)`)
        .setFooter(`${PREFIX}rule 11`);

        return ruleEmbed;

    },

    ruleTwelve() {

        ruleEmbed.setTitle(`Rule 12`)
        .setDescription(`Don't farm for levels on my levelling Bot.
        It has a cooldown to prevent that anyways...
        (Use of the Roulette Commands don't count! I mean in terms of spamming (RULE 4) and other methods)`)
        .setFooter(`${PREFIX}rule 12`);

        return ruleEmbed;

    },

    ruleThirteen() {

        ruleEmbed.setTitle(`Rule 13`)
        .setDescription(`Please try to keep all Bot Command usage within <#681807000249827349>.
        We don't want the other chats getting flooded with Bot responses!`)
        .setFooter(`${PREFIX}rule 13`);

        return ruleEmbed;

    },
};