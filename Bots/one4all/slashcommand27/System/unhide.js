const { Client, Collection,PermissionsBitField,SlashCommandBuilder, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const systemDB = new Database("/Json-db/Bots/systemDB.json")
module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('unhide')
    .setDescription('اظهار الروم'), // or false
async execute(interaction) {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return interaction.reply({content:`**لا تمتلك صلاحية لفعل ذلك**` , ephemeral:true})
    await interaction.deferReply({ephemeral:false})
    interaction.channel.permissionOverwrites.create(interaction.channel.guild.roles.everyone, { ViewChannel: true });
              return interaction.editReply({content:`**${interaction.channel} has been unhidded**`})
}
}