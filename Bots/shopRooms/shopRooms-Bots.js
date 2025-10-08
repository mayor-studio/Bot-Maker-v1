
  const { Client, Collection, discord,GatewayIntentBits, PermissionsBitField,Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const shopRoomsDB = new Database("/Json-db/Bots/shopRoomsDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

let shopRooms = tokens.get('shopRooms')
if(!shopRooms) return;

const path = require('path');
const { readdirSync } = require("fs");
shopRooms.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client24 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client24.commands = new Collection();
  require(`./handlers/events`)(client24);
  client24.events = new Collection();
  require(`../../events/requireBots/shopRooms-commands`)(client24);
  const rest = new REST({ version: '10' }).setToken(token);
  client24.setMaxListeners(1000)

  client24.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client24.user.id),
          { body: shopRoomsSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client24.once('ready', () => {
    client24.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`shopRooms bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client24.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`shopRooms`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client24.users.cache.get(owner) || await client24.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : رومات شوب\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`shopRooms`, filtered);
          await client24.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`../shopRooms/handlers/events`)(client24)
  const folderPath = path.join(__dirname, 'slashcommand24');
  client24.shopRoomsSlashCommands = new Collection();
  const shopRoomsSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("shopRooms commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          shopRoomsSlashCommands.push(command.data.toJSON());
          client24.shopRoomsSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand24');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/shopRooms-commands`)(client24)
require("./handlers/events")(client24)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client24.once(event.name, (...args) => event.execute(...args));
	} else {
		client24.on(event.name, (...args) => event.execute(...args));
	}
	}




  client24.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client24.shopRoomsSlashCommands.get(interaction.commandName);
	    
      if (!command) {
        return;
      }
      if (command.ownersOnly === true) {
        if (owner != interaction.user.id) {
          return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
        }
      }
      try {

        await command.execute(interaction);
      } catch (error) {
			console.log(error)
		}
    }
  } )

  client24.on("ready" , async() => {
    setInterval(async() => {
        let guild = await client24.guilds.cache.first()
        if(!guild) return;
      let openhour = await shopRoomsDB.get(`openhour_${guild.id}` )
      let openminute = await shopRoomsDB.get(`openminute_${guild.id}` )
      let closehour = await shopRoomsDB.get(`closehour_${guild.id}` )
     let closeminute =  await shopRoomsDB.get(`closeminute_${guild.id}` )
      let logroom = await shopRoomsDB.get(`logroom_${guild.id}` )
      let category = await shopRoomsDB.get(`category_${guild.id}` )
       if(!openhour || !openminute || !closehour || !closeminute || !logroom || !category) return;
       if(!shopRoomsDB.has(`rooms_${guild.id}`)) {
           await shopRoomsDB.set(`rooms_${guild.id}` , [])
       }
       let rooms = await shopRoomsDB.get(`rooms_${guild.id}`)
       if(!rooms || rooms.length <= 0) return;
       const now = moment();
       const hour = now.hour();
       const minute = now.minute();
       let second = now.second();
       if (hour == openhour && minute == openminute && second == 0) {
        rooms.forEach(async(room) => {
          let theChannel =  await guild.channels.create({
               name:`${room.roomname}`,
               parent:`${category}`,
               permissionOverwrites:[
                   {
                       id: guild.id,
                       deny: [
                           PermissionsBitField.Flags.AttachFiles,
                           PermissionsBitField.Flags.EmbedLinks,
                           PermissionsBitField.Flags.SendMessages,
                           PermissionsBitField.Flags.MentionEveryone
                       ],
                   },
                   ...room.permissionRoles.map((roleId) => ({ id: roleId, allow: [PermissionsBitField.Flags.AttachFiles,
                       PermissionsBitField.Flags.EmbedLinks,
                       PermissionsBitField.Flags.SendMessages,
                       PermissionsBitField.Flags.MentionEveryone] })),
               ]})
               
           })
           let theLogRoom = await guild.channels.cache.find(ch => ch.id == logroom)
           let today = new Date().toLocaleString();
           let embed1 = new EmbedBuilder()
           .setDescription(`**تم فتح الرومات بنجاح بتاريخ\`\`\`${today}\`\`\`**`)
           .setTimestamp()

           await theLogRoom.send({embeds:[embed1]})
       }
       if(hour == closehour && minute == closeminute && second == 0) {
        rooms.forEach(async(room) => {
        
          let theChannel = await guild.channels.cache.find(ch => ch.name == room.roomname)
          try{
              theChannel.delete()
          }catch{
              setTimeout(() => {
                  theChannel.delete()
              }, 1000);
          }
              
          })
          let theLogRoom = await guild.channels.cache.find(ch => ch.id == logroom)
          let today = new Date().toLocaleString();
           let embed1 = new EmbedBuilder()
           .setDescription(`**تم غلق الرومات بنجاح بتاريخ\`\`\`${today}\`\`\`**`)
           .setTimestamp()

           await theLogRoom.send({embeds:[embed1]})
       }

    }, 1000);
  })


  client24.on("interactionCreate" , async(interaction) => {
    if(interaction.customId === "help_general"){
      const embed = new EmbedBuilder()
          .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
          .setTitle('قائمة اوامر البوت')
          .setDescription('**لا توجد اوامر في هذا القسم حاليا**')
          .setTimestamp()
          .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
          .setColor('DarkButNotBlack');
      const btns = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐').setDisabled(true),
          new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Primary).setEmoji('👑'),
      )
  
      await interaction.update({embeds : [embed] , components : [btns]})
    }else if(interaction.customId === "help_owner"){
      const embed = new EmbedBuilder()
      .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
      .setTitle('قائمة اوامر البوت')
      .addFields(
        {name : `\`/setup\`` , value : `لتسطيب نظام رومات الشوب`},
        {name : `\`/add-room\`` , value : `اضافة روم الى نظام رومات الشوب`},
        {name : `\`/remove-room\`` , value : `ازالة روم من نظام رومات الشوب`},
        {name : `\`/create-rooms\`` , value : `لانشاء رومات الشوب يدويا`},
        {name : `\`/delete-rooms\`` , value : `لحذف رومات الشوب يدويا`},
      )
      .setTimestamp()
      .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
      .setColor('DarkButNotBlack');
  const btns = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐'),
      new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Primary).setEmoji('👑').setDisabled(true),
  )
  
  await interaction.update({embeds : [embed] , components : [btns]})
    }
  })

   client24.login(token)
   .catch(async(err) => {
    const filtered = shopRooms.filter(bo => bo != data)
			await tokens.set(`shopRooms` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
