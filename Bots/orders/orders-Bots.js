
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const ordersDB = new Database("/Json-db/Bots/ordersDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


let orders = tokens.get('orders')
if(!orders) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
orders.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client21 =new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client21.commands = new Collection();
  client21.setMaxListeners(1000)

  require(`./handlers/events`)(client21);
  client21.events = new Collection();
  require(`../../events/requireBots/orders-commands.js`)(client21);
  const rest = new REST({ version: '10' }).setToken(token);
  client21.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client21.user.id),
          { body: ordersSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
        client21.once('ready', () => {
    client21.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`orders bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client21.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`orders`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client21.users.cache.get(owner) || await client21.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : طلبات\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`orders`, filtered);
          await client21.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`../orders/handlers/events`)(client21)
    require(`../orders/handlers/orders-events`)(client21)
  const folderPath = path.join(__dirname, 'slashcommand21');
  client21.ordersSlashCommands = new Collection();
  const ordersSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("orders commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          ordersSlashCommands.push(command.data.toJSON());
          client21.ordersSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand21');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/orders-commands.js`)(client21)
require("./handlers/events")(client21)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client21.once(event.name, (...args) => event.execute(...args));
	} else {
		client21.on(event.name, (...args) => event.execute(...args));
	}
	}
  client21.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client21.ordersSlashCommands.get(interaction.commandName);
	    
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

  client21.on("interactionCreate" , async(interaction) => {
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
        {name : `\`/setup-orders\`` , value : `لتسطيب نظام الطلبات`},
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

   client21.login(token)
   .catch(async(err) => {
    const filtered = orders.filter(bo => bo != data)
			await tokens.set(`orders` , filtered)
      console.log(`${clientId} Not working and removed `)
   });
})
