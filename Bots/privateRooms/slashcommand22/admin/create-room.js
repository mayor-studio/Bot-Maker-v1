const { ChatInputCommandInteraction , Client, Collection,ChannelType ,SlashCommandBuilder, GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder , ButtonStyle , Message, Embed,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/privateRoomsDB.json")
const rooms = new Database("/Json-db/Bots/privateRoomsDB.json")
const ms = require('ms');
let moment = require('moment');
module.exports ={
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('create-room')
    .setDescription('انشاء روم لشخص')
    .addStringOption(Option => Option
        .setName(`roomname`)
        .setDescription(`اسم الروم`)
        .setRequired(true))
    .addUserOption(Option => Option
        .setName(`roomowner`)
        .setDescription(`صاحب الروم`)
        .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    async execute(interaction, client) {
        try {
            let roomowner = interaction.options.getUser(`roomowner`)
            let roomname = interaction.options.getString(`roomname`)
            if(!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField .Flags.Administrator)) return interaction.reply({ephemeral:true,content:`**انت لا تمتلك ادمن ستريتور**`})
           if(!db.has(`recipient_${interaction.guild.id}`) || !db.has(`category_${interaction.guild.id}`) || !db.has(`roomprice_${interaction.guild.id}`) || !db.has(`renewprice_${interaction.guild.id}`) || !db.has(`role_${interaction.guild.id}`)) {
            return interaction.reply({content:`**الرجاء تحديد جميع الاعدادات قبل استخدام الامر**`})
           }
           let roleid = await db.get(`role_${interaction.guild.id}`)
           let category = await db.get(`category_${interaction.guild.id}`)
            let theRoom = await interaction.guild.channels.create({
                name:`${roomname}`,
                parent:`${category}`,
                type:`${ChannelType.GuildText}`,
                rateLimitPerUser:60 * 30,
                permissionOverwrites:[
                    {
                        id: interaction.guild.id,
                        deny: [
                            PermissionsBitField.Flags.AttachFiles,
                            PermissionsBitField.Flags.EmbedLinks,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.MentionEveryone
                        ],
                    },
                    {
                        id: roomowner.id,
                        allow: [
                            PermissionsBitField.Flags.AttachFiles,
                            PermissionsBitField.Flags.EmbedLinks,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.MentionEveryone
                        ],
                    },
                ]
            })
            await rooms.push(`rooms_${interaction.guild.id}`,{
                roomowner:roomowner.id,
                roomname:roomname,
                roomid:theRoom.id,
                guildid:interaction.guild.id,
                timeleft:60 * 60 * 24 * 7
            })

            let theMember = await interaction.guild.members.cache.find(mem => mem.id == roomowner.id)
            if(theMember){
                let theRole = await interaction.guild.roles.cache.find(ro => ro.id == roleid)
                if(theRole){
                    await theMember.roles.add(theRole).catch(() => {return;})
                }
            }
            let embed1 = new EmbedBuilder()
            .setColor(`Yellow`)
            .setTimestamp(Date.now() + ms(`7d`))
            .setThumbnail(roomowner.displayAvatarURL({dynamic : true}))
            .addFields(
            {
                name:`**صاحب الروم**`,value:`${roomowner}`,inline:false
            },
            {
                name:`**مدة الروم**`,value:`**\`\`\`7 أيام\`\`\`**`,inline:false
            },
            {
                name:`**تاريخ بداية الروم**`,value:`**\`\`\`${moment().format('YYYY-MM-DD')}\`\`\`**`,inline:false
            },
            {
                name:`**تاريخ انتهاء الروم**`,value:`**\`\`\`${moment().add(7 , 'days').format('YYYY-MM-DD')}\`\`\`**`,inline:false
            },
            )
            await theRoom.send({embeds:[embed1]})
            return interaction.reply({content:`**تم بنجاح ${theRoom}**`})   
        } catch (error) {
            console.log(error)
        }
    }
}