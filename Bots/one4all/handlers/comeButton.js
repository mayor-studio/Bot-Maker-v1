const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector, Embed } = require("discord.js");
const settings = require("../../../database/settings")
const managers = require("../../../database/managers")
const panels = require("../../../database/panels")
const { Database } = require("st.db")
let ticketDB = new Database("/Json-db/Bots/ticketDB")
const ticketsManager = new Database("/Json-db/Bots/ticketDB.json")
module.exports = (client27) => {
    client27.on(Events.InteractionCreate , async(interaction) =>{
    if(interaction.isButton()) {
        let guilddata = await settings.findOne({guildid:interaction.guild.id})
        if(!guilddata) return;
        let panelsRoom = guilddata.panelsRoom;
        let transcripts = guilddata.transcripts;
        let paneltext = guilddata.paneltext;
        if(!guilddata || !panelsRoom || !transcripts || !paneltext) return interaction.reply({content:`**لم يتم تحديد الاعدادات**` , ephemeral:true})
        if(interaction.customId == "come_button") {
            let selected = await ticketsManager.get(`${interaction.channel.id}`)
            if(selected.opener == interaction.user.id) return interaction.reply({content:`**لا تستطيع استدعاء نفسك**` , ephemeral:true})
            try {
                let theOpener = await interaction.guild.members.cache.find(mem => mem.id == selected.opener)
                if(!theOpener)  return interaction.reply({content:`**لم استطع نداء صاحب التكت**`})
                let embed1 = new EmbedBuilder()
            .setTitle(`**تم استدعائك في التكت**`)
            .setDescription(`**الرجاء سرعة التوجه الى : ${interaction.channel}**`)
            .setTimestamp()
            await theOpener.send({embeds:[embed1]})
            return interaction.reply({content:`**تم استدعاء صاحب التكت بنجاح**`})
            } catch (error) {
                return interaction.reply({content:`**لم استطع نداء صاحب التكت**`})
            }

        }
    }
}
)
}

