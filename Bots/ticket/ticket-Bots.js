
  const { Client,Discord, Collection, AuditLogEvent,discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, Embed } = require("discord.js");
const { Database } = require("st.db")
const ticketDB = new Database("/Json-db/Bots/ticketDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


  let ticket = tokens.get('ticket')
if(!ticket) return;
const path = require('path');
const { readdirSync } = require("fs");
let theowner;
ticket.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client7 =new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client7.commands = new Collection();
  require(`./handlers/events`)(client7);
  require(`./handlers/ticketClaim`)(client7);
  require(`./handlers/ticketCreate`)(client7);
  require(`./handlers/ticketDelete`)(client7);
  require(`./handlers/ticketSubmitCreate`)(client7);
  require(`./handlers/ticketUnclaim`)(client7);
  require(`./handlers/comeButton`)(client7);
  require(`./handlers/reset`)(client7);
  require('./handlers/supportTicketPanel')(client7);
  client7.events = new Collection();
  require(`../../events/requireBots/ticket-commands`)(client7);
  const rest = new REST({ version: '10' }).setToken(token);
  client7.setMaxListeners(1000)

  client7.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client7.user.id),
          { body: ticketSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client7.once('ready', () => {
    client7.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`ticket bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client7.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`ticket`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client7.users.cache.get(owner) || await client7.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : تكت\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`ticket`, filtered);
          await client7.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`./handlers/events`)(client7)

  const folderPath = path.join(__dirname, 'slashcommand7');
  client7.ticketSlashCommands = new Collection();
  const ticketSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("ticket commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          ticketSlashCommands.push(command.data.toJSON());
          client7.ticketSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand7');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/ticket-commands`)(client7)
require("./handlers/events")(client7)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client7.once(event.name, (...args) => event.execute(...args));
	} else {
		client7.on(event.name, (...args) => event.execute(...args));
	}
	}




  client7.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client7.ticketSlashCommands.get(interaction.commandName);
	    
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




  client7.on("interactionCreate" , async(interaction) => {
    //--
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
            new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Danger).setEmoji('👑'),
            new ButtonBuilder().setCustomId('help_admin').setLabel('ادمن').setStyle(ButtonStyle.Primary).setEmoji('🔰'),
        )
  
      await interaction.update({embeds : [embed] , components : [btns]})
    //--
    }else if(interaction.customId === "help_owner"){
      const embed = new EmbedBuilder()
      .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
      .setTitle('قائمة اوامر البوت')
      .addFields(
        {name : `\`/setup\`` , value : `لتسطيب نظام التكت`},
        {name : `\`/add-ticket-panel\`` , value : `اضافة بانل لنظام التكت`},
        {name : `\`/send-panel\`` , value : `لارسال بانل التكت`},
        {name : `\`/remove-ticket-panel\`` , value : `حذف بانل من نظام التكت`},
        {name : `\`/reset\`` , value : `لتصفير نقاط شخص`},
        {name : `\`/reset-all\`` , value : `لتصفير نقاط الكل`},
        {name : `\`/top\`` , value : `لرؤية نقاط جميع الاعضاء`},

      )
      .setTimestamp()
      .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
      .setColor('DarkButNotBlack');
      const btns = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐'),
        new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Danger).setEmoji('👑').setDisabled(true),
        new ButtonBuilder().setCustomId('help_admin').setLabel('ادمن').setStyle(ButtonStyle.Primary).setEmoji('🔰'),
    )
  await interaction.update({embeds : [embed] , components : [btns]})
    //--
    }else if(interaction.customId === "help_admin"){
      const embed = new EmbedBuilder()
      .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
      .setTitle('قائمة اوامر البوت')
      .addFields(
        {name : `\`/points\`` , value : `للاستعلام عن نقاطك او نقاط شخص محدد`},
        {name : `\`/come\`` , value : `لاستدعاء شخص`},
      )
      .setTimestamp()
      .setFooter({text : `Requested By ${interaction.user.username}` , iconURL : interaction.user.displayAvatarURL({dynamic : true})})
      .setColor('DarkButNotBlack');
      const btns = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('help_general').setLabel('عامة').setStyle(ButtonStyle.Success).setEmoji('🌐'),
        new ButtonBuilder().setCustomId('help_owner').setLabel('اونر').setStyle(ButtonStyle.Danger).setEmoji('👑'),
        new ButtonBuilder().setCustomId('help_admin').setLabel('ادمن').setStyle(ButtonStyle.Primary).setEmoji('🔰').setDisabled(true),
    )
  
  await interaction.update({embeds : [embed] , components : [btns]})  
    }
  })

   client7.login(token)
   .catch(async(err) => {
    const filtered = ticket.filter(bo => bo != data)
			await tokens.set(`ticket` , filtered)
      console.log(`${clientId} Not working and removed `)
   });










































})
