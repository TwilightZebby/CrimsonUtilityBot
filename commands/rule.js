let { PREFIX } = require('../config.js');
const Discord = require("discord.js");
const { client } = require('../bot_modules/constants.js');
let ruleFile = require('../bot_modules/ruleEmbeds.js');

module.exports = {
    name: 'rule',
    description: 'Used to quickly bring up one of the Rules',
    usage: '<ruleNumber>',
    //aliases: [''],
    args: true,
    commandType: 'general',
    async execute(message, args) {
      
      // Variables
      let ruleOption = args.shift();


      switch (ruleOption) {

        // IF ALL (me only)
        case "all":
          // Check if me
          if ( message.author.id !== '156482326887530498' ) {
            return message.reply(`Sorry, you can't use that option!`);
          }
          // Create all the Embeds
          await message.channel.send(ruleFile.ruleOne());
          await message.channel.send(ruleFile.ruleTwo());
          await message.channel.send(ruleFile.ruleThree());
          await message.channel.send(ruleFile.ruleFour());
          await message.channel.send(ruleFile.ruleFive());
          await message.channel.send(ruleFile.ruleSix());
          await message.channel.send(ruleFile.ruleSeven());
          await message.channel.send(ruleFile.ruleEight());
          await message.channel.send(ruleFile.ruleNine());
          await message.channel.send(ruleFile.ruleTen());
          await message.channel.send(ruleFile.ruleEleven());
          await message.channel.send(ruleFile.ruleTwelve());
          await message.channel.send(ruleFile.ruleThirteen());
          break;


        case "1":
          await message.channel.send(ruleFile.ruleOne());
          break;


        case "2":
          await message.channel.send(ruleFile.ruleTwo());
          break;
        
        
        case "3":
          await message.channel.send(ruleFile.ruleThree());
          break;


        case "4":
          await message.channel.send(ruleFile.ruleFour());
          break;


        case "5":
          await message.channel.send(ruleFile.ruleFive());
          break;


        case "6":
          await message.channel.send(ruleFile.ruleSix());
          break;


        case "7":
          await message.channel.send(ruleFile.ruleSeven());
          break;


        case "8":
          await message.channel.send(ruleFile.ruleEight());
          break;


        case "9":
          await message.channel.send(ruleFile.ruleNine());
          break;


        case "10":
          await message.channel.send(ruleFile.ruleTen());
          break;


        case "11":
          await message.channel.send(ruleFile.ruleEleven());
          break;


        case "12":
          await message.channel.send(ruleFile.ruleTwelve());
          break;


        case "13":
          await message.channel.send(ruleFile.ruleThirteen());
          break;

        
        default:
          return await message.reply(`Oops, something went wrong! Please try again...`);


      }

      //END OF COMMAND
    },
};
