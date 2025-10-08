const { ChatInputCommandInteraction , Client , SlashCommandBuilder,SelectMenuBuilder,StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/database/data")
const setting = new Database("/database/settingsdata/setting")
const prices = new Database("/database/settingsdata/prices.json")
const statuses = new Database("/database/settingsdata/statuses")
const { mainguild } = require('../../../config.json');

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('send-buy-bot-panel')
    .setDescription(`ارسال بانل شراء البوتات`),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
async execute(interaction , client) {
    await interaction.deferReply({ephemeral:false})
    let price1 = await setting.get(`balance_price_${interaction.guild.id}`) ?? 1000;
    let recipient = await setting.get(`recipient_${interaction.guild.id}`)
    let logroom =  await setting.get(`log_room_${interaction.guild.id}`)
    let probot = await setting.get(`probot_${interaction.guild.id}`)
    let clientrole = await setting.get(`client_role_${interaction.guild.id}`)
    let buybotroom = await setting.get(`buy_bot_room${interaction.guild.id}`)
    if(!price1 || !recipient || !logroom || !probot || !clientrole || !buybotroom) return interaction.editReply({content:`**لم يتم تحديد الاعدادات**`})
    let theroom = interaction.guild.channels.cache.find(ch => ch.id == buybotroom)

    const theBotMember = interaction.guild.members.cache.get(interaction.client.user.id);
    const botRole = theBotMember.displayHexColor || "Random";

    let embed = new EmbedBuilder()
                    .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                    .setTitle(`**🛒 لوحة شراء البوتات**`)
                    .setDescription(`**👇 اختر ما ترغب في شرائه من القائمة أدناه**`)
                    .setColor(botRole)
                    .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))

    if(interaction.guild.id === mainguild){
        embed.setImage(`https://postimg.cc/PLJFDhtt`)
        
    }

    const select = new StringSelectMenuBuilder()
                    .setCustomId('select_buy')
                    .setPlaceholder('قم بالاختيار من القائمة')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`<:bot:1324742309543284788>`)    
                            .setLabel('Buy bot')
                            .setDescription('شراء بوت شغال 24 ساعة')
                            .setValue('selectBuyBot'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`<:emoji_73:1326144870040993864>`)   
                            .setLabel('Bot token')
                            .setDescription('شراء توكن بوت')
                            .setValue('selectBuyToken'),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(`<a:loading:1324747781478289450>`)
                            .setLabel('Reset')
                            .setDescription('عمل اعادة تعيين للاختيار')
                            .setValue('Reset_Selected'),
                    );
    const row0 = new ActionRowBuilder().addComponents(select);

    const button = new ButtonBuilder().setCustomId(`buyBotInfo`).setStyle(2).setEmoji(`<:emoji_75:1326145345356562473>`);
    const row1 = new ActionRowBuilder().addComponents(button);

    theroom.send({embeds:[embed] , components:[row0 , row1]})
    if(setting.has(`subscribe_room_${interaction.guild.id}`)) {
        let subscriberoo = setting.get(`subscribe_room_${interaction.guild.id}`)
        let subscriberoom = interaction.guild.channels.cache.find(ch => ch.id == subscriberoo)
        let embed2 = new EmbedBuilder()
                            .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                            //.setTitle(`**بانل اشتراك في بوت الميكر**`)
                            .setColor(botRole)
                            .setDescription(`** ## :bar_chart: باقات الاشتراك في خدمات البوتات :bar_chart:

### <:emoji_79:1326154984294977586> | البرايم :
- بيع البوتات العادية
- ~~بيع توكنات البوتات~~
- ~~تخصيص اسم و صورة لبوتك~~
- ~~تجديد البوتات تلقائيا~~
- ~~بيع بوت واحد للكل~~
- ~~بيع ميكرات~~
- - ___السعر___ : \`${prices.get(`bot_maker_price_`+interaction.guild.id) ?? "150"}\` عملة شهريا

### <:emoji_76:1326146193566335057> | البريميوم :
- بيع البوتات العادية
- بيع توكنات البوتات
- تخصيص اسم و صورة لبوتك
- تجديد البوتات تلقائيا
- ~~بيع بوت واحد للكل~~
- ~~بيع ميكرات~~
- - ___السعر___ : \`${prices.get(`bot_maker_premium_price_`+interaction.guild.id) ?? "350"}\` عملة شهريا

### <a:emoji_1736250154751:1326154011233226832> | التيميت :
- بيع البوتات العادية
- بيع توكنات البوتات
- تخصيص اسم و صورة لبوتك
- تجديد البوتات تلقائيا
- بيع بوت واحد للكل
- بيع ميكرات ( برايم / بريميوم  / ~~  الـتـيـمـيـت  ~~ )
- - ___السعر___ : \`${prices.get(`bot_maker_ultimate_price_`+interaction.guild.id) ?? "500"}\` عملة شهريا

### <:mayor:1324396250912784416> التيميت بلس :
- جميع مميزات باقة التيميت
- بيع ميكرات التيميت
- يجب شراء بوت ميكر التيميت أولاً
- - ___السعر___ : \`700\` عملة اسبوعيا **`)
                            .setThumbnail(interaction.client.user.displayAvatarURL({dynamic : true}))

        const select2 = new StringSelectMenuBuilder()
        .setCustomId('select_bot')
        .setPlaceholder('الاشتراك في بوت الميكر')
        .addOptions(
            new StringSelectMenuOptionBuilder()
            .setEmoji(`<:emoji_79:1326154984294977586>`)
            .setLabel('Prime')
            .setDescription('الاشتراك في بوت الميكر برايم')
            .setValue('Bot_Maker_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setEmoji(`<:emoji_76:1326146193566335057>`)
            .setLabel('Premium')
            .setDescription('الاشتراك في بوت الميكر بريميوم')
            .setValue('Bot_Maker_Premium_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setEmoji(`<a:emoji_1736250154751:1326154011233226832>`)
            .setLabel('Ultimate')
            .setDescription('الاشتراك في بوت الميكر التيميت')
            .setValue('Bot_Maker_Ultimate_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setEmoji(`<:mayor:1324396250912784416>`)
            .setLabel('Ultimate Plus')
            .setDescription('الاشتراك في بوت الميكر التيميت بلس')
            .setValue('Bot_Maker_Ultimate_Plus_Subscribe'),
            new StringSelectMenuOptionBuilder()
            .setEmoji(`<a:loading:1324747781478289450>`)
            .setLabel('Reset')
            .setDescription('عمل اعادة تعيين للاختيار')
            .setValue('Reset_Selected'),);
            const row2 = new ActionRowBuilder().addComponents(select2)

            
        subscriberoom.send({embeds:[embed2],components:[row2 , row1]})
    }
    return interaction.editReply({content:`**تم ارسال الرسالة بنجاح**`})
}
}