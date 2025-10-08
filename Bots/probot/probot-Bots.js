
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const probotDB = new Database("/Json-db/Bots/probotDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


let probot = tokens.get('probot')
if(!probot) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
probot.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client9 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client9.commands = new Collection();
  require(`./handlers/events`)(client9);
  client9.events = new Collection();
  require(`../../events/requireBots/probot-Commands`)(client9);
  const rest = new REST({ version: '10' }).setToken(token);
  client9.setMaxListeners(1000)

  client9.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client9.user.id),
          { body: probotSlashCommands },
          );
          
        } catch {
        }

    });
        client9.once('ready', () => {
    client9.guilds.cache.forEach(guild => {
        guild.members.fetch().then(members => {
            if (members.size < 10) {
                console.log(`probot bot : Guild: ${guild.name} has less than 10 members`);
            }
        }).catch(console.error);
    });
});
  //------------- التحقق من وقت البوت --------------//
  client9.on("ready", async () => {
    setInterval(async () => {
      let BroadcastTokenss = tokens.get(`probot`) || [];
      let thiss = BroadcastTokenss.find((br) => br.token == token);
      if (thiss) {
        if (thiss.timeleft <= 0) {
          const user = await client9.users.cache.get(owner) || await client9.users.fetch(owner);
          const embed = new EmbedBuilder()
                    .setDescription(`**مرحبا <@${thiss.owner}>،لقد انتهى اشتراك بوتك <@${thiss.clientId}>. النوع : بروبوت وهمي\nالاشتراك انتهى**`)
                    .setColor("DarkerGrey")
                    .setTimestamp();
          await user.send({embeds : [embed]}).catch((err) => {console.log(err)})

          const filtered = BroadcastTokenss.filter((bo) => bo != thiss);
          await tokens.set(`probot`, filtered);
          await client9.destroy().then(async () => {
            console.log(`${clientId} Ended`);
          });
        }
      }
    }, 1000);
  });
    require(`../probot/handlers/events`)(client9)

  const folderPath = path.join(__dirname, 'slashcommand9');
  client9.probotSlashCommands = new Collection();
  const probotSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("probot commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          probotSlashCommands.push(command.data.toJSON());
          client9.probotSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'slashcommand9');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/probot-Commands`)(client9)
require("./handlers/events")(client9)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client9.once(event.name, (...args) => event.execute(...args));
	} else {
		client9.on(event.name, (...args) => event.execute(...args));
	}
	}



  client9.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client9.probotSlashCommands.get(interaction.commandName);
	    
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
      } catch {
		}
    }
  } )



  client9.on('messageCreate', async (message) => {
      if (message.content.includes('type these numbers to confirm')) return;

      if (message.author.id === '282859044593598464') {
          try {
            // رسالة الدايلي
            if (message.content.includes('You are eligible to receive your daily for the bot!')) {
              const buttonComponent = message.components.find(component => component.type === 'ACTION_ROW')?.components.find(component => component.type === 'BUTTON');
              await message.delete();
              const row = new ActionRowBuilder()
                .addComponents(buttonComponent);
              return message.channel.send({
                content: `${message.content}`,
                components: [row]
              });
            }else if (message.content.includes('You can get up to 2600 credits if you vote for ProBot!')) {
              const buttonComponent = message.components.find(component => component.type === 'ACTION_ROW')?.components.find(component => component.type === 'BUTTON');
              await message.delete();
              const row = new ActionRowBuilder()
                .addComponents(buttonComponent);
              return message.channel.send({
                content: `${message.content}`,
                components: [row]
              });
            }else if (message.author.bot && message.embeds.length > 0) {
              if(message.embeds[0].description && message.embeds[0].description.includes('This command moved')){
                await message.delete();
                const embed = new EmbedBuilder(message.embeds[0]);
                const btn = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('More Info').setStyle(ButtonStyle.Link).setURL('https://discord.com/blog/welcome-to-the-new-era-of-discord-apps?ref=probot'))
                return message.channel.send({embeds : [embed] , components : [btn] , allowedMentions : {repliedUser : false}}) 
              }else{
                await message.delete();
                const embed = new EmbedBuilder(message.embeds[0]);
                return message.channel.send({ embeds: [embed] });
              }
              }else if (message.content && message.attachments.size > 0) {
                  const attach = message.attachments.first();
                  await message.channel.send({ content: `${message}`, files: [{ name: `'pic.png'`, attachment: attach.url }] });
                  return await message.delete();
              }else if (message.attachments.size > 0) {
                  const attach = message.attachments.first();
                  await message.channel.send({ files: [{ name: 'pic.png', attachment: attach.url }] });
                  return await message.delete();
  
              }else{
                  await message.delete().catch(err => { })
                  const sentMessage = await message.channel.send({ content: `${message}` });
                  if (sentMessage.content.includes('Cool down')) {
                    setTimeout(() => {
                      sentMessage.delete();
                    }, 3000);
                  }
                  if (sentMessage.content.includes(`Deleting messages`)) {
                    setTimeout(() => {
                      sentMessage.delete();
                    }, 3000);
                  }
            }
          } catch (error) {
            console.log(error)
          }
      }
  });

  client9.on("messageCreate", async (message) => {
    try {
        const args = message.content.split(" ");
        let id = message.content.split(" ")[1];
        const member = message.mentions.members?.first() || message.guild.members.cache.get(id);
        if (message.author.id === "282859044593598464") {
          if (message.content.includes(`type these numbers to confirm`)) {
            user = message.mentions.repliedUser?.id;
            username = message.mentions.repliedUser.username;

            await message.channel.send({ files: [{ name: `pic.png`, attachment: `${message.attachments.first().url}` }], content: `${message}` }).then(async (msg) => {

              message.delete();

              const filter = (m) => m.author.id === user;
              const collector = message.channel.createMessageCollector({ filter, max: 1, time: 20000, errors: ["time"] });

              collector.on("collect", async (response) => {
                if(msg){
                  msg.delete();
                }
              });

              collector.on("end", (collected) => {
                if (collected.size === 0) {
                  if (msg) {
                    msg.delete()
                  }
                }
              });
            })
          }
        }
    } catch (error) {
      
    }
  });




   client9.login(token)
   .catch(async(err) => {
    const filtered = probot.filter(bo => bo != data)
			await tokens.set(`probot` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
