
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, Attachment } = require("discord.js");
const { Database } = require("st.db")
const systemDB = new Database("/Json-db/Bots/systemDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


let system = tokens.get('system')
if(!system) return;
const path = require('path');
const { readdirSync } = require("fs");
let theowner;
let thetoken;
system.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  thetoken = token;
  const client17 = new Client({intents:131071, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client17.commands = new Collection();
  require(`./handlers/events`)(client17);
  client17.events = new Collection();
  require(`../../events/requireBots/system-commands`)(client17);
  const rest = new REST({ version: '10' }).setToken(token);
  client17.setMaxListeners(1000)

  client17.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client17.user.id),
          { body: systemSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
          
        }

    });
        client17.once('ready', () => {
    client17.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`system bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client17.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`system`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client17.users.cache.get(owner) || await client17.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : سيستم\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`system`, filtered);
          await client17.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`../system/handlers/events`)(client17)

  const folderPath = path.join(__dirname, 'slashcommand17');
  client17.systemSlashCommands = new Collection();
  const systemSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("system commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          systemSlashCommands.push(command.data.toJSON());
          client17.systemSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand17');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/system-commands`)(client17)
require("./handlers/events")(client17)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client17.once(event.name, (...args) => event.execute(...args));
	} else {
		client17.on(event.name, (...args) => event.execute(...args));
	}
	}




  client17.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client17.systemSlashCommands.get(interaction.commandName);
	    
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
        return;
		}
    }
  } )




client17.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  try {
    if(message.content == "-" || message.content == "خط") {
      const line = systemDB.get(`line_${message.guild.id}`)
      if(line) {
        await message.delete()
        return message.channel.send({content:`${line}`});
      }
    }
  } catch (error) {
    return;
  }
 
})

client17.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  const autoChannels = systemDB.get(`line_channels_${message.guild.id}`)
    if(autoChannels) {
      if(autoChannels.length > 0) {
        if(autoChannels.includes(message.channel.id)) {
          const line = systemDB.get(`line_${message.guild.id}`)
      if(line) {
        return message.channel.send({content:`${line}`});
        }
      }
      }
    }
})



client17.on("interactionCreate" , async(interaction) => {
  if(interaction.customId === "help_general"){
    const embed = new EmbedBuilder()
        .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
        .setTitle('قائمة اوامر البوت')
        .addFields(
          {name : `\`/avatar\`` , value : `لرؤية افتارك او فتار شخص اخر`},
          {name : `\`/server\`` , value : `لرؤية معلومات السيرفر`},
          {name : `\`/user\`` , value : `لرؤية معلومات حسابك او حساب شخص اخر`},
          {name : `\`/banner\`` , value : `لرؤية بانرك او بانر شخص اخر`},
        )
        .setTimestamp()
        .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
        .setColor('DarkButNotBlack');
    const btns = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐').setDisabled(true),
        new ButtonBuilder().setCustomId('help_admin').setLabel('ادمن').setStyle(ButtonStyle.Primary).setEmoji('🛠️'),
    )

    await interaction.update({embeds : [embed] , components : [btns]})
  }else if(interaction.customId === "help_admin"){
    const embed = new EmbedBuilder()
    .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
    .setTitle('قائمة اوامر البوت')
    .addFields(
      {name : `\`/ban\`` , value : `لاعطاء باند لشخص او ازالته`},
      {name : `\`/clear\`` , value : `لحذف عدد من الرسائل`},
      {name : `\`/come\`` , value : `لاستدعاء شخص`},
      {name : `\`/embed\`` , value : `لقول كلام في ايمبد`},
      {name : `\`/hide\`` , value : `لاخفاء روم`},
      {name : `\`/kick\`` , value : `لاعطاء طرد لشخص او ازالته`},
      {name : `\`/lock\`` , value : `لقفل روم`},
      {name : `\`/nickname\`` , value : `اعطاء اسم مستعار لشخص او ازالته`},
      {name : `\`/mute\`` , value : `لاعطاء ميوت لشخص او ازالته`},
      {name : `\`/role\`` , value : `لاعطاء رتبة لشخص او ازالتها`},
      {name : `\`/roles\`` , value : `للاستعلام عن رتب السيرفر`},
      {name : `\`/say\`` , value : `لقول كلام`},
      {name : `\`/send\`` , value : `لارسال رسالة لشخص ما`},
      {name : `\`/timeout\`` , value : `لاعطاء تايم اوت لشخص او ازالته`},
      {name : `\`/unhide\`` , value : `لاظهار روم`},
      {name : `\`/unlock\`` , value : `لفتح الروم`},
    )
    .setTimestamp()
    .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
    .setColor('DarkButNotBlack');
const btns = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐'),
    new ButtonBuilder().setCustomId('help_admin').setLabel('ادمن').setStyle(ButtonStyle.Primary).setEmoji('🛠️').setDisabled(true),
)

await interaction.update({embeds : [embed] , components : [btns]})
  }
})

   client17.login(token)
   .catch(async(err) => {
    const filtered = system.filter(bo => bo != data)
			await tokens.set(`system` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
