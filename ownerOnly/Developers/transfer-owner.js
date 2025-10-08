const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");const { Database } = require("st.db")
const db = new Database("/database/settings")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tokens = new Database("/database/tokens")
const { clientId,owner} = require('../../config.json');
module.exports = {
    data: new SlashCommandBuilder()
    .setName('transfer-owner')
    .setDescription('نقل اشتراك سيرفر')
    .addStringOption(Option => Option
        .setName(`type`)
        .setDescription(`نوع الاشتراك`)
        .setRequired(true)
        .addChoices(
            {
                name:`Prime` , value:`tier1`
            },
            {
                name:`Premium` , value:`tier2`
            },
            {
                name:`Ultimate` , value:`tier3`
            }
        ))
    .addStringOption(Option => Option
        .setName(`oldownerid`)
        .setDescription(`ايدي المالك القديم`)
        .setRequired(true))
        .addStringOption(Option => Option
            .setName(`newownerid`)
            .setDescription(`ايدي المالك الجديد`)
            .setRequired(true))
    ,
    async execute(interaction) {
       if(!owner.includes(interaction.user.id)) return;
       const type = interaction.options.getString(`type`)
       const oldownerid = interaction.options.getString(`oldownerid`)
       const newownerid = interaction.options.getString(`newownerid`)
       let subsearch = 0;
       let serversearch = 0;
       if(type == 'tier1') {
        subsearch = tier1subscriptions.get(`${type}_subs`)
        serversearch = subsearch.find(su => su.ownerid == oldownerid)
    }else if(type == 'tier2') {
        subsearch = tier2subscriptions.get(`${type}_subs`)
        serversearch = subsearch.find(su => su.owner == oldownerid)
    } else if(type == 'tier3') {
        subsearch = tier3subscriptions.get(`${type}_subs`)
        serversearch = subsearch.find(su => su.owner == oldownerid)
       }
       
       if(!serversearch) {
        return interaction.reply({content:`**لم يتم العثور على اشتراك بهذا المالك**`})
       }

       let {ownerid , guildid , timeleft} = serversearch;
       if(type == 'tier1') {
        serversearch.ownerid = newownerid
    }else if(type == 'tier2') {
        serversearch.owner = newownerid
    } else if(type == 'tier3') {
        serversearch.owner = newownerid
       }
       if(type == 'tier1') {
        await tier1subscriptions.set(`${type}_subs` , subsearch)
    }else if(type == 'tier2') {
        await tier2subscriptions.set(`${type}_subs` , subsearch)
    } else if(type == 'tier3') {
        await tier3subscriptions.set(`${type}_subs` , subsearch)
       }
       const doneembed = new EmbedBuilder()
       .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#000000')
        .setTitle(`**تم نقل المالك بنجاح**`)
       return interaction.reply({embeds:[doneembed]})
    }
}