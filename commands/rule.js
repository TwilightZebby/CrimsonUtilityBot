let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');
let rules = require('../bot_storage/rules.json');

module.exports = {
    name: 'rule',
    description: 'Used to quickly bring up one of the Rules',
    usage: '<ruleNumber ie: one, two, four, etc>',
    //aliases: [''],
    args: true,
    commandType: 'general',
    async execute(message, args) {
      
      let action = args.shift().toLowerCase();

      if ( action === "edit" ) {

        // Me only check
        if ( message.author.id !== "156482326887530498" ) {
          return await message.reply(`Sorry, only TwilightZebby can edit Rules`);
        }

        // Fetch updated Rule & which rule
        let rulesArray = rules["all"];
        let ruleToEdit = String(args.shift().toLowerCase());
        // Check input is a valid Rule
        if ( !rulesArray.includes(ruleToEdit) ) {
          return await message.reply(`Sorry, but that isn't an existing Rule. Please try again...`);
        }
        let editRuleString = String(message.content);
        let amountToRemove = 12 + ruleToEdit.length + 1;
        editRuleString = editRuleString.slice(amountToRemove, editRuleString.length);
        
        
        // Fetch Message & Embed within #rules
        let ruleID = rules[ruleToEdit].id;
        let rulesChannel = message.guild.channels.resolve('693365400607391795');
        let storedMessage = await rulesChannel.messages.fetch(ruleID);
        let messageEmbed = storedMessage.embeds[0];

        // Edit and send edit
        messageEmbed.setDescription(editRuleString);
        storedMessage.edit(messageEmbed);

        
        // Store edits in JSON file
        rules[ruleToEdit].content = editRuleString;
        fs.writeFile("./bot_storage/rules.json", JSON.stringify(rules, null, 4), async (err) => {
          if(err) { 
            console.log(err);
            return await message.reply(`Something went wrong when saving the Rule Edit. Please check the Console Logs for more information...`);
          } 
        });

        await message.reply(`Successfully edited rule **${ruleToEdit}**!`);
        return await message.delete();














      }
      else if ( action === "add" ) {
        
        // Me only check
        if ( message.author.id !== "156482326887530498" ) {
          return await message.reply(`Sorry, only TwilightZebby can add new Rules`);
        }


        // Fetch Rule Number & Content
        let newRuleNumber = String(args.shift().toLowerCase());
        let newRuleContent = args.join(' ');

        // Slap into an Embed for preview to confirm Rule
        const newRuleEmbed = new Discord.MessageEmbed().setColor('#000000')
        .setTitle(`Rule ${newRuleNumber}`)
        .setDescription(newRuleContent)
        .setFooter(`${PREFIX}rule ${newRuleNumber}`);

        await message.channel.send(newRuleEmbed);
        await message.channel.send(`__**Confirmation of new rule**__\nPlease confirm the creation of this new rule by sending **\`confirm\`** now...`);


        // Confirmation
        let filter = m => m.content.includes("confirm");
        let confirmCollector = message.channel.createMessageCollector(filter, { time: 10000 })
        .on('collect', m => confirmCollector.stop())
        .on('end', (collected, reason) => Confirmation(collected, reason));


        async function Confirmation(collected, reason) {

          if ( reason === "time" || reason === "idle" ) {
            return await message.reply(`⌛ Timeout Error\nYou were too slow I'm afraid. Please try again`);
          }

          let collect = collected.array();
          userConfirm = collect[0];

          if ( userConfirm === null ) {
            return await message.reply(`Sorry, something went wrong. Please try again later....`)
          } 

          if ( !userConfirm.content.includes("confirm") ) {
            return await message.reply(`No confirmation found, cancelling new Rule creation.`);
          }


          // Send Embed to #rules channel
          let rulesChannel = message.guild.channels.resolve('693365400607391795');
          let newRuleMessage = await rulesChannel.send(newRuleEmbed);


          // Store new Rule in JSON file
          rules[newRuleNumber] = {
            "id": newRuleMessage.id,
            "content": newRuleContent
          };

          fs.writeFile("./bot_storage/rules.json", JSON.stringify(rules, null, 4), async (err) => {
            if(err) { 
              console.log(err);
              return await message.reply(`Something went wrong when saving the new Rule. Please check the Console Logs for more information...`);
            } 
          });

          return await message.reply(`Successfully added new Rule to ${rulesChannel}!`);
          
        }










      }
      else {

        // Check word inputted is a valid Rule
        let rulesArray = rules["all"];
        if ( !rulesArray.includes(action) ) {
          return await message.reply(`Sorry, but that isn't a valid Rule or Option. Please try again...`);
        }


        // Fetch Rule
        let fetchedRule = rules[action].content;

        // If there are any "\n" in the Rule Content, swap it for `\n`
        if ( fetchedRule.includes("\n") ) {
          fetchedRule.replace(/\n/g, `\n`);
        }


        // Create Embed
        const ruleEmbed = new Discord.MessageEmbed().setColor('#000000')
        .setTitle(`Rule ${action}`)
        .setDescription(fetchedRule)
        .setFooter(`${PREFIX}rule ${action}`);

        // Send Embed
        return await message.channel.send(ruleEmbed);

      }

      //END OF COMMAND
    },
};
