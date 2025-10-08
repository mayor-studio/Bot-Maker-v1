const { SlashCommandBuilder, EmbedBuilder ,ButtonStyle, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/protectDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('anti-delete-roles')
    .setDescription('تسطيب نظام الحماية من حظر الرتب')
    .addStringOption(Option => Option
        .setName(`status`)
        .setDescription(`الحالة`)
        .setRequired(true)
        .addChoices(
            {
                name:`On` , value:`on`
            },
            {
                name:`Off` , value:`off`
            }
        ))
        .addIntegerOption(Option => Option
            .setName(`limit`)
            .setDescription(`العدد المسموح في اليوم`)
            .setRequired(true))
   , // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
    try {
      const status = interaction.options.getString(`status`)
      const limit = interaction.options.getInteger(`limit`)
      await db.set(`antideleteroles_status_${interaction.guild.id}` , status)
      await db.set(`antideleteroles_limit_${interaction.guild.id}` , limit)
      await db.set(`rolesdelete_users_${interaction.guild.id}` , [])
              return interaction.editReply({content:`**تم بنجاح تعيين نظام الحماية من البان \n - تاكد من رفع رتبتي لاعلى رتبة في السيرفر**`})
    } catch {
    }
}
}