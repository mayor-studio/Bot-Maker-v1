const { Client, Collection, discord,TextInputBuilder,TextInputStyle,ModalBuilder,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const autolineDB = new Database("/Json-db/Bots/autolineDB.json")
const db = new Database("/Json-db/Bots/ordersDB.json")

let autoline = tokens.get(`autoline`)
const path = require('path');
const { readdirSync } = require("fs");
module.exports = (client21) => {
  client21.on(Events.InteractionCreate , async(interaction) =>{
    if (interaction.isStringSelectMenu()) {
      let products_room = await db.get(`products_room_${interaction.guild.id}`)
      let products_role = await db.get(`products_role_${interaction.guild.id}`)
      let currency_room = await db.get(`currency_room_${interaction.guild.id}`)
      let currency_role = await db.get(`currency_role_${interaction.guild.id}`)
      let services_room =  await db.get(`services_room_${interaction.guild.id}`)
      let services_role = await db.get(`services_role_${interaction.guild.id}`)
      let designs_room = await db.get(`designs_room_${interaction.guild.id}`)
      let designs_role = await db.get(`designs_role_${interaction.guild.id}`)
      let admins_role = await db.get(`admins_role_${interaction.guild.id}`)
        let line = await db.get(`line_${interaction.guild.id}`)
        if(interaction.customId == 'select_bot') {
          let selected = interaction.values[0]
        if(selected == "orderProduct") {
            if(!products_role || !products_room || !currency_role || !currency_room || !services_role || !services_room || !designs_role || !designs_room || !admins_role || !line) return interaction.reply({content:`**لم يتم تحديد الاعدادات كاملة الرجاء الانتظار الى حين تحديدها ثم الطلب**` , ephemeral:true})
            const modal = new ModalBuilder()
            .setCustomId('OrderProduct_Modal')
         .setTitle('طلب منتج');
            const Theorder = new TextInputBuilder()
            .setCustomId('the_order')
            .setLabel("الطلب")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
            const firstActionRow = new ActionRowBuilder().addComponents(Theorder);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal)
        }
        if(selected == "orderCurrency") {
            if(!products_role || !products_room || !currency_role || !currency_room || !services_role || !services_room || !designs_role || !designs_room || !admins_role || !line) return interaction.reply({content:`**لم يتم تحديد الاعدادات كاملة الرجاء الانتظار الى حين تحديدها ثم الطلب**` , ephemeral:true})
            const modal = new ModalBuilder()
            .setCustomId('orderCurrency_Modal')
         .setTitle('طلب عملات');
            const Theorder = new TextInputBuilder()
            .setCustomId('the_order')
            .setLabel("الطلب")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
            const firstActionRow = new ActionRowBuilder().addComponents(Theorder);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal)
        }
        if(selected == "orderServices") {
            if(!products_role || !products_room || !currency_role || !currency_room || !services_role || !services_room || !designs_role || !designs_room || !admins_role || !line) return interaction.reply({content:`**لم يتم تحديد الاعدادات كاملة الرجاء الانتظار الى حين تحديدها ثم الطلب**` , ephemeral:true})
            const modal = new ModalBuilder()
            .setCustomId('orderServices_Modal')
         .setTitle('طلب خدمة');
            const Theorder = new TextInputBuilder()
            .setCustomId('the_order')
            .setLabel("الطلب")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
            const firstActionRow = new ActionRowBuilder().addComponents(Theorder);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal)
        }
        if(selected == "orderDesigns") {
            if(!products_role || !products_room || !currency_role || !currency_room || !services_role || !services_room || !designs_role || !designs_room || !admins_role || !line) return interaction.reply({content:`**لم يتم تحديد الاعدادات كاملة الرجاء الانتظار الى حين تحديدها ثم الطلب**` , ephemeral:true})
            const modal = new ModalBuilder()
            .setCustomId('orderDesigns_Modal')
         .setTitle('طلب تصاميم');
            const Theorder = new TextInputBuilder()
            .setCustomId('the_order')
            .setLabel("الطلب")
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
            const firstActionRow = new ActionRowBuilder().addComponents(Theorder);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal)
        }
        if(selected == "Reset_Selected_order") {
            try {
                return interaction.update().catch(async() => {return;})
              } catch {
                return;
              }
        }
    }
}
if(interaction.isModalSubmit) {
  let products_room = await db.get(`products_room_${interaction.guild.id}`)
        let products_role = await db.get(`products_role_${interaction.guild.id}`)
        let currency_room = await db.get(`currency_room_${interaction.guild.id}`)
        let currency_role = await db.get(`currency_role_${interaction.guild.id}`)
        let services_room =  await db.get(`services_room_${interaction.guild.id}`)
        let services_role = await db.get(`services_role_${interaction.guild.id}`)
        let designs_room = await db.get(`designs_room_${interaction.guild.id}`)
        let designs_role = await db.get(`designs_role_${interaction.guild.id}`)
        let admins_role = await db.get(`admins_role_${interaction.guild.id}`)
        let line = await db.get(`line_${interaction.guild.id}`)
  if(interaction.customId == "OrderProduct_Modal") {
    const theOrder = interaction.fields.getTextInputValue(`the_order`)
    let theRoom = interaction.guild.channels.cache.find(ch => ch.id == products_room)
    let theRole = interaction.guild.roles.cache.find(ro => ro.id == products_role)
        let embed1 = new EmbedBuilder()
                          .setTitle(`**طـلـب جـديـد**`)
                          .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
                          .setFooter({text:`${interaction.user.username}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
                          .setDescription(`**صـاحـب الـطـلـب : ${interaction.user}\nالـطـلـب : \`\`\`${theOrder}\`\`\`**`)
                          .setTimestamp()
        const free = new ButtonBuilder()
                          .setCustomId(`deleteOrder`)
                          .setLabel('حـذف الـطـلـب')
                          .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(free);
        await interaction.reply({content:`**تم الطلب بنجاح**` , ephemeral:true})
        await theRoom.send({content:`**${theRole}**` , embeds:[embed1] , components:[row]})
        await theRoom.send({files:[{name:`line.png` , attachment:line}]})
  }
  if(interaction.customId == "orderDesigns_Modal") {
    const theOrder = interaction.fields.getTextInputValue(`the_order`)
    let theRoom = interaction.guild.channels.cache.find(ch => ch.id == designs_room)
    let theRole = interaction.guild.roles.cache.find(ro => ro.id == designs_role)
    let embed1 = new EmbedBuilder()
    .setTitle(`**طـلـب جـديـد**`)
    .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setFooter({text:`${interaction.user.username}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setDescription(`**صـاحـب الـطـلـب : ${interaction.user}\nالـطـلـب : \`\`\`${theOrder}\`\`\`**`)
        .setTimestamp()
        const free = new ButtonBuilder()
        .setCustomId(`deleteOrder`)
        .setLabel('حـذف الـطـلـب')
        .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder().addComponents(free);
        await interaction.reply({content:`**تم الطلب بنجاح**` , ephemeral:true})
        await theRoom.send({content:`**${theRole}**` , embeds:[embed1] , components:[row]})
        await theRoom.send({files:[{name:`line.png` , attachment:line}]})
  }
  if(interaction.customId == "orderCurrency_Modal") {
    const theOrder = interaction.fields.getTextInputValue(`the_order`)
    let theRoom = interaction.guild.channels.cache.find(ch => ch.id == currency_room)
    let theRole = interaction.guild.roles.cache.find(ro => ro.id == currency_role)
    let embed1 = new EmbedBuilder()
    .setTitle(`**طـلـب جـديـد**`)
    .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setFooter({text:`${interaction.user.username}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setDescription(`**صـاحـب الـطـلـب : ${interaction.user}\nالـطـلـب : \`\`\`${theOrder}\`\`\`**`)
        .setTimestamp()
        const free = new ButtonBuilder()
        .setCustomId(`deleteOrder`)
        .setLabel('حـذف الـطـلـب')
        .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder()
        .addComponents(free);
        interaction.reply({content:`**تم الطلب بنجاح**` , ephemeral:true})
        await theRoom.send({content:`**${theRole}**` , embeds:[embed1] , components:[row]})
        await theRoom.send({files:[{name:`line.png` , attachment:line}]})
  }
  if(interaction.customId == "orderServices_Modal") {
    const theOrder = interaction.fields.getTextInputValue(`the_order`)
    let theRoom = interaction.guild.channels.cache.find(ch => ch.id == services_room)
    let theRole = interaction.guild.roles.cache.find(ro => ro.id == services_role)
    let embed1 = new EmbedBuilder()
    .setTitle(`**طـلـب جـديـد**`)
    .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setFooter({text:`${interaction.user.username}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setDescription(`**صـاحـب الـطـلـب : ${interaction.user}\nالـطـلـب : \`\`\`${theOrder}\`\`\`**`)
        .setTimestamp()
        const free = new ButtonBuilder()
        .setCustomId(`deleteOrder`)
        .setLabel('حـذف الـطـلـب')
        .setStyle(ButtonStyle.Danger);
        const row = new ActionRowBuilder()
        .addComponents(free);
        interaction.reply({content:`**تم الطلب بنجاح**` , ephemeral:true})
        await theRoom.send({content:`**${theRole}**` , embeds:[embed1] , components:[row]})
        await theRoom.send({files:[{name:`line.png` , attachment:line}]})
  }
}
if(interaction.isButton()) {
  if(interaction.customId === "help_owner" || interaction.customId === "help_general") return;
  let admins_role = await db.get(`admins_role_${interaction.guild.id}`)
  if (!interaction.member.roles.cache.some(role => role.id === admins_role)) return interaction.reply({content:`**لا تمتلك صلاحية لفعل ذلك**` , ephemeral:true});
  await interaction.reply({content:`**تم الحذف بنجاح**` , ephemeral:true})
  await interaction.message.delete();
}

}
  )}