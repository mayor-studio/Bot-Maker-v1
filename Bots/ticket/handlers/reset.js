const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector, Embed } = require("discord.js");
const settings = require("../../../database/settings")
const { Database } = require("st.db")
const managers = require("../../../database/managers")
const panels = require("../../../database/panels")
let ticketDB = new Database("/Json-db/Bots/ticketDB")
module.exports = (client7) => {
  client7.on(Events.InteractionCreate , async(interaction) =>{
      if (interaction.isStringSelectMenu()) {
      if(interaction.customId == 'tickt_select') {
        if(interaction.values[0] == "reset"){
            try {
                return await interaction.update().catch(async() => {return;})
              } catch  {
                return;
              }
        }
    }
  }

  
  })};