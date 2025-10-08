const { SlashCommandBuilder, EmbedBuilder ,ButtonStyle, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db")
const giveawayDB = new Database("/Json-db/Bots/giveawayDB.json")
const db = new Database("/database/data")
const moment = require('moment');
const ms = require('ms')
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('greroll')
    .setDescription('اعادة فائزين جيف اواي')
    .addStringOption(Option => 
        Option
        .setName('giveawayid')
        .setDescription('ايدي رسالة الجيف اواي')
        .setRequired(true))
        , // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:true})
const giveawayid = interaction.options.getString(`giveawayid`)
let theguild = interaction.guild;

let giveaways = giveawayDB.get(`giveaways_${interaction.guild.id}`)
if(!giveaways) {
    await giveawayDB.set(`giveaways_${interaction.guild.id}` , [])
} 
giveaways = giveawayDB.get(`giveaways_${interaction.guild.id}`)
const giveawayFind = giveaways.find(gu => gu.messageid == giveawayid)
if(!giveawayFind) return interaction.editReply({content:`**لم يتم العثور على جيف اواي بهذا الايدي**`, ephemeral:true})
let {messageid , channelid , entries , winners , prize , duration,dir1,dir2,host,ended} = giveawayFind;
const theroom = await theguild.channels.cache.find(ch => ch.id == channelid)
await interaction.channel.messages.fetch(giveawayid)
await interaction.channel.messages.fetch({limit:50})
const themsg = await theroom.messages.cache.find(msg => msg.id == messageid)
if(ended == false) return interaction.editReply({content:`**هذا الجيف اواي لم ينتهى بعد**`})
if(entries.length > 0 && entries.length >= winners) {
    const theWinners = [];
    for(let i = 0; i < winners; i++) {
      let winner = Math.floor(Math.random() * entries.length);
      let winnerExcept = entries.splice(winner, 1)[0];
      theWinners.push(winnerExcept);
    }
    
    themsg.reply({content:`Congratulations ${theWinners}! You won the **${prize}**!`})
  }else{
    themsg.reply({content:`**لا يوجد عدد من المشتركين كافي**`})
  }
return interaction.editReply({content:`**تم اعادة فائزين هذا الجيف اواي بنجاح**`})
}
}