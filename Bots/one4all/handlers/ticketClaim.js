const { StringSelectMenuOptionBuilder , StringSelectMenuBuilder , SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector, Embed } = require("discord.js");
const settings = require("../../../database/settings")
const managers = require("../../../database/managers")
const panels = require("../../../database/panels")
const { Database } = require("st.db")
let ticketDB = new Database("/Json-db/Bots/ticketDB")
const ticketsManager = new Database("/Json-db/Bots/ticketDB.json")
module.exports = (client27) => {
    client27.on(Events.InteractionCreate , async(interaction) =>{
    if(interaction.isButton()) {
        try {
            let guilddata = await settings.findOne({guildid:interaction.guild.id})
            if(!guilddata) return;
            let panelsRoom = guilddata.panelsRoom;
            let transcripts = guilddata.transcripts;
            let paneltext = guilddata.paneltext;
            if(!guilddata || !panelsRoom || !transcripts || !paneltext) return interaction.reply({content:`**لم يتم تحديد الاعدادات**` , ephemeral:true})
            if(interaction.customId === "claim_ticket") {
                let selected = await ticketsManager.get(`${interaction.channel.id}`)
                let panelFind = await panels.findOne({guildid:interaction.guild.id , panelId:selected.panelId})
                let {panelCategory , panelRole , panelWelcome ,panelName ,panelId, panelDescription , panelNumber} = panelFind;
    
                if(!interaction.member.roles.cache.has(`${panelRole}`)) return interaction.reply({content:`**لا تمتلك الصلاحية لفعل هذا**` , ephemeral:true})
                await interaction.channel.setName(`ticket-${interaction.user.username}`).then(async() => {
                    let claimembed = new EmbedBuilder()
                    .setDescription(`**تم استلام التكت بواسطه : ${interaction.user}**`)
                    .setTimestamp();
                    await ticketsManager.set(`${interaction.user.id}_claimer_${interaction.channel.id}` , true)
                    const claimedticket = new ButtonBuilder()
                                .setCustomId(`claimed_ticket`)
                                .setLabel(`تم استلامها`)
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true)
                    const deleteticket = new ButtonBuilder()
                                .setCustomId(`delete_ticket`)
                                .setLabel(`حذف التكت`)
                                .setStyle(ButtonStyle.Danger)
                    const comeButton = new ButtonBuilder()
                                .setCustomId(`come_button`)
                                .setLabel(`استدعاء صاحب التكت`)
                                .setStyle(ButtonStyle.Secondary)
                    const select = new StringSelectMenuBuilder()
                                .setCustomId('supportPanel')
                                .setPlaceholder('لوحة تحكم السبورت')
                                .addOptions(
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('تغيير اسم التكت')
                                        .setValue('renameTicket')
                                        .setEmoji('✍🏼'),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('اضافة عضو للتذكرة')
                                        .setValue('addMemberToTicket')
                                        .setEmoji('✅'),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('حذف عضو من التذكرة')
                                        .setValue('removeMemberFromTicket')
                                        .setEmoji('⛔'),
                                    new StringSelectMenuOptionBuilder()
                                        .setLabel('اعادة تحميل')
                                        .setValue('refreshSupportPanel')
                                        .setEmoji('🔄'),
                                );
                    const row = new ActionRowBuilder().addComponents(claimedticket , deleteticket , comeButton);
                    const row2 = new ActionRowBuilder().addComponents(select)
                    let opener = ticketsManager.get(`${interaction.channel.id}`)
                    let opener2 = opener.opener
                    await interaction.channel.permissionOverwrites.set([
                        {
                            id:interaction.guild.id,
                            deny:[PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id:panelRole,
                            deny:[PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id:interaction.user.id,
                            allow:[PermissionsBitField.Flags.ViewChannel , PermissionsBitField.Flags.SendMessages],
                        },
                        {
                            id:opener2,
                            allow:[PermissionsBitField.Flags.ViewChannel , PermissionsBitField.Flags.SendMessages],
                        }
                    ])
                    let userprofile = await managers.findOne({guildid:interaction.guild.id , id:interaction.user.id})
                    if(!userprofile) {
                        new managers({
                            guildid:interaction.guild.id,
                            id:interaction.user.id,
                            points:1
                        }).save()
                    }else{
                        let userpoints = userprofile.points;
                        userprofile.points = parseInt(userpoints) + 1
                        userprofile.save();
                    }

                    await interaction.update().catch(async() => {return;})
                    await interaction.message.edit({components:[row , row2]})
                    await interaction.channel.send({embeds:[claimembed]})
                })
            }
           
        } catch (error) {
            console.log(error)
        }
    }
  }
    )};

