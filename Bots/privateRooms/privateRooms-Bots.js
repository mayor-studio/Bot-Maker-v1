
const { Client, Collection,ChannelType ,SlashCommandBuilder, GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder , ButtonStyle , Message, Embed,PermissionsBitField } = require("discord.js")
const { Database } = require("st.db")
const privateRoomsDB = new Database("/Json-db/Bots/privateRoomsDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

const rooms = new Database("/Json-db/Bots/privateRoomsDB.json")
const db = new Database("/Json-db/Bots/privateRoomsDB.json")
let moment = require('moment');
const ms = require("ms")
const buyCooldown = new Collection()
let privateRooms = tokens.get('privateRooms')
if(!privateRooms) return;

const path = require('path');
const { readdirSync } = require("fs");
const client = require("../../index.js")
let theowner;
privateRooms.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client22 = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client22.commands = new Collection();
  client22.setMaxListeners(1000)

  require(`./handlers/events.js`)(client22);
  client22.events = new Collection();
  require(`../../events/requireBots/privateRooms-commands.js`)(client22);
  const rest = new REST({ version: '10' }).setToken(token);
  client22.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client22.user.id),
          { body: privateRoomsSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client22.once('ready', () => {
    client22.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`privateRoom bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client22.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`privateRooms`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client22.users.cache.get(owner) || await client22.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : رومات خاصة\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`privateRooms`, filtered);
          await client22.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`../privateRooms/handlers/events.js`)(client22)
  const folderPath = path.join(__dirname, 'slashcommand22');
  client22.privateRoomsSlashCommands = new Collection();
  const privateRoomsSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("privateRooms commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          privateRoomsSlashCommands.push(command.data.toJSON());
          client22.privateRoomsSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}

let commandsDir2 = path.join(__dirname);
client22.commands = new Collection()
const commands = [];
const table2 = new ascii('Prefix Commands').setJustify();
for (let folder of readdirSync(commandsDir2+`/commands22`).filter(f => f.endsWith(`.js`))) {
	  let command = require(`${commandsDir2}/commands22/${folder}`);
	  if(command) {
		commands.push(command);
  client22.commands.set(command.name, command);
		  if(command.name) {
			  table2.addRow(`${prefix}${command.name}` , '🟢 Working')
		  }
		  if(!command.name) {
			  table2.addRow(`${prefix}${command.name}` , '🔴 Not Working')
		  }
	  }
}


require(`../../events/requireBots/privateRooms-commands.js`)(client22)
require("./handlers/events.js")(client22)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client22.once(event.name, (...args) => event.execute(...args));
	} else {
		client22.on(event.name, (...args) => event.execute(...args));
	}
	}

client22.on("messageCreate" , async(message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if(!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g); 
  const cmd = args.shift().toLowerCase();
  if(cmd.length == 0 ) return;
    if(!client22.commands.has(cmd)) return;
  let command = client22.commands.get(cmd)
  if(!command) command = client22.commands.get(client22.commandaliases.get(cmd));

  if(command) {
    if(command.cooldown) {
        
      if(cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ embeds:[{description:`**عليك الانتظار\`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true}).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**`}]}).then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()))
      command.run(client, message, args)
      cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
      setTimeout(() => {
        cooldown.delete(`${command.name}${message.author.id}`)
      }, command.cooldown);
  } else {
    command.run(client, message, args)
  }
}});



  client22.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client22.privateRoomsSlashCommands.get(interaction.commandName);
	    
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
			return
		}
    }
  } )

  
  client22.on("ready" , async() => {
    let guild = client22.guilds.cache.first()
    setInterval(async() => {
        if(!guild) return 
      let theRooms = await rooms.get(`rooms_${guild.id}`)
      if(!theRooms) return;
      if(theRooms.length <= 0) return;
      theRooms.forEach(async(room) => {
        let {roomowner , timeleft ,guildid, roomname , roomid} = room;
        timeleft = timeleft - 1
        room.timeleft = timeleft
        await rooms.set(`rooms_${guild.id}` , theRooms)
        if(timeleft == 86400) {
          let theGuild = client22.guilds.cache.find(gu => gu.id == guildid);
          let theRoom = theGuild.channels.cache.find(ch => ch.id == roomid);
          let embed1 = new EmbedBuilder()
          .setTimestamp(Date.now() + ms(`1d`))
          .setTitle(`**متبقي يوم واحد فقط على انتهاء الروم**`)
          .setDescription(`**الرجاء فتح تكت والتجديد والا سيتم حذف الروم بعد يوم واحد فقط**`)
          await theRoom.send({content : `<@${roomowner}>` , embeds:[embed1]})
        }
        if(timeleft <= 0) {
          let roleid = await db.get(`role_${guild.id}`)
          let theOwner = client22.users.fetch(roomowner);
          let theGuild = client22.guilds.cache.find(gu => gu.id == guildid);
          let theUser = theGuild.members.cache.find(us => us.id == roomowner)
          let theRoom = theGuild.channels.cache.find(ch => ch.id == roomid)
          let theRole = theGuild.roles.cache.find(ro => ro.id == roleid)
          if(!theRoom) return;
          await theRoom.delete().catch(async() => {return;})
          await theUser.roles.remove(theRole).catch(async() => {return;})
          let filtered = await theRooms.filter(ro => ro.roomowner != roomowner)
          await rooms.set(`rooms_${guild.id}` , filtered);
          let embed2 = new EmbedBuilder()
          .setTimestamp(Date.now())
          .setTitle(`**انتهى الروم الخاص بك**`)
          .setDescription(`**تم حذف رومك بسبب عدم التجديد في الوقت المناسب**`)
          await theUser.send({embeds:[embed2]})
        }
      })
    }, 1000);
    
   })

   client22.on("interactionCreate" , async(interaction) => {
    if(interaction.customId === "help_general"){
      const embed = new EmbedBuilder()
          .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
          .setTitle('قائمة اوامر البوت')
          .addFields(
            {name : `\`${prefix}buy-room\`` , value : `لشراء روم خاصة`},
            {name : `\`${prefix}renew-room\`` , value : `لتجديد روم خاصة`},
          )
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
        {name : `\`/setup\`` , value : `لتسطيب نظام الرومات الخاصة`},
        {name : `\`/create-room\`` , value : `لانشاء روم لشخص`},
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

   client22.login(token)
   .catch(async(err) => {
    const filtered = privateRooms.filter(bo => bo != data)
			await tokens.set(`privateRooms` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
