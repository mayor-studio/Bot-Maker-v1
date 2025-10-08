const { client,Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { readdirSync } = require("fs")
const colors = require('colors');
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('node:path');
const fs = require('node:fs');
const mongodb = require('mongoose');
const ms = require("ms")
var prettySeconds = require('pretty-seconds');
const mainBot = require('../../index')
const { Database } = require("st.db")
const tokens = new Database("tokens/tokens")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const botStatusDB = new Database("Json-db/Others/botStatus")
const setting = new Database("/database/settingsdata/setting")
const usersdata = new Database(`/database/usersdata/usersdata`);
const subs = tier3subscriptions.get(`tier3_subs`);
const tier3subscriptionsplus = new Database("/database/makers/tier3/plus")
const statuses = new Database("/database/settingsdata/statuses")
const prices = new Database("/database/settingsdata/prices.json")
const { WebhookClient } = require('discord.js')
const { makerSubsLogsWebhookUrl } = require('../../config.json');
const webhookClient = new WebhookClient({ url : makerSubsLogsWebhookUrl });
var AsciiTable = require('ascii-table')
const tablee = new AsciiTable('Ultimate makers')
tablee.setHeading('' , 'UserName' , 'Bot ID' , 'Owner' , 'Guild ID' , 'timeleft' , 'Status')

if(!subs) return;
if(subs.length < 0) return;
let currentIndex = 0;
subs.forEach(async(sub) => {
    let {token , owner , guildid , prefix , timeleft} = sub;
    const client3 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
	client3.setMaxListeners(999999)
	client3.commandaliases = new Collection()
    const rest = new REST({ version: '10' }).setToken(token);
    module.exports = client3;
        client3.on("ready" , async() => {
            setInterval(async() => {
				const subs2 = tier3subscriptions.get(`tier3_subs`);
				if(!subs2) return;
                const sub = subs2.find(su => su.guildid == guildid)
				if(!sub) return;
                const theTimeleft = sub.timeleft;
				if(theTimeleft === 259200){
					await client3.users.fetch(owner);
                    const theowner = client3.users.cache.find(us => us.id == owner);
                    const warnEmbed = new EmbedBuilder()
                    .setTitle(`🔔 تنبيه باقتراب انتهاء الاشتراك 🔔`)
					.setColor('Yellow') 
                    .setDescription(`** مرحبًا [${theowner.username}]،
نود إبلاغك بأن انتهاء اشتراك بوت الميكر الالتيميت الخاص بك سيكون خلال 3 أيام.
يرجى التفكير في تجديد الاشتراك قبل انتهاء المدة لضمان استمرار الخدمة.
شكرًا لتفهمك!**`)
                    .setTimestamp();
                    await theowner.send({embeds:[warnEmbed]}).catch(() => {return;})

					await webhookClient.send({ embeds: [
							new EmbedBuilder()
									.setTitle(`🔔 تنبيه باقتراب انتهاء الاشتراك 🔔`)
									.setColor('Yellow')
									.addFields(
										{name : `الاشتراك :` , value : `\`\`\`التيميت\`\`\`` , inline : true},
										{name : `السيرفر` , value : `\`\`\`${guildid}\`\`\`` , inline : true},
										{name : `صاجب الاشتراك` , value : `\`\`\`${owner}\`\`\`` , inline : true},
										{name : `ايدي البوت :` , value : `\`\`\`${client3.user.id}\`\`\`` , inline : true},
										{name : `توكن البوت :` , value : `\`\`\`${token}\`\`\`` , inline : true},
										{name : `الوقت المتبقي :` , value : `\`\`\`${prettySeconds(timeleft)}\`\`\`` , inline : true},
										
									)
									.setTimestamp()
								] }).catch((err) => {return;});
				}
                if(theTimeleft == 0) {
                    await client3.users.fetch(owner);
                    const theowner = client3.users.cache.find(us => us.id == owner);
                    const endEmbed = new EmbedBuilder()
                    .setTitle(`🚨 **تنبيه بانتهاء الاشتراك** 🚨`)
					.setColor('Red')
                    .setDescription(`**انتهى اشتراك البوت ميكر التيميت الخاص بك. يمكنك إعادة الشراء مجددًا دون فقدان أي من البيانات.** \n \`\`\`شكرًا لاختيارك خدماتنا! نحن نقدر دعمك وثقتك بنا\`\`\``)
                    .setTimestamp();
                    const sub4 = tier3subscriptionsplus.get(`plus`)
                    if(sub4){
	                const filtered = await sub4.filter(su => su.guildid != guildid)
					await tier3subscriptionsplus.set(`plus` , filtered)
					}
                    await theowner.send({embeds:[endEmbed]}).catch(() => {return;})

					await webhookClient.send({ embeds: [
							new EmbedBuilder()
									.setTitle(`🚨 **تنبيه بانتهاء الاشتراك** 🚨`)
									.setColor('Red')
									.addFields(
										{name : `الاشتراك :` , value : `\`\`\`التيميت\`\`\`` , inline : true},
										{name : `السيرفر` , value : `\`\`\`${guildid}\`\`\`` , inline : true},
										{name : `صاجب الاشتراك` , value : `\`\`\`${owner}\`\`\`` , inline : true},
										{name : `ايدي البوت :` , value : `\`\`\`${client3.user.id}\`\`\`` , inline : true},
										{name : `توكن البوت :` , value : `\`\`\`${token}\`\`\`` , inline : true},										
									)
									.setTimestamp()
								] }).catch((err) => {return;});
					
                    await client3.destroy();
                }
				const sub3 = tier3subscriptionsplus.get(`plus`)
				if(!sub3) return;
				const theSubGet = sub3.find(ch => ch.guildid == guildid)
				if(!theSubGet) return;
				const theTimeleft2 = theSubGet.timeleft;
				theSubGet.timeleft = theTimeleft2 - 1
				await tier3subscriptionsplus.set(`plus` , sub3)
				if(theTimeleft2 <= 0) {

					await webhookClient.send({ embeds: [
							new EmbedBuilder()
									.setTitle(`🚨 **انتهاء اشتراك** 🚨`)
									.setColor('Red')
									.addFields(
										{name : `الاشتراك :` , value : `\`\`\`التيميت بلس\`\`\`` , inline : true},
										{name : `السيرفر` , value : `\`\`\`${theSubGet.guildid}\`\`\`` , inline : true},								
									)
									.setTimestamp()
								] }).catch((err) => {return;});
					

					const filtered = await sub3.filter(su => su.guildid != guildid)
					await tier3subscriptionsplus.set(`plus` , filtered)
				}
            }, 1000);
            try {
                await rest.put(
                    Routes.applicationCommands(client3.user.id),
                    { body: premiumSlashCommands },
                );
            } catch (error) {
                console.error(error);
            }
        })

		client3.on("ready" , async() => {
			setInterval(() => {
				let guilds = client3.guilds.cache.forEach(async(guild) => {
				let messageInfo = setting.get(`statusmessageinfo_${guild.id}`)
				if(!messageInfo) return;
				const {messageid , channelid} = messageInfo;
				const theChan = guild.channels.cache.find(ch => ch.id == channelid)
                if(!theChan || !messageid) return;
				await theChan.messages.fetch(messageid).catch(() => {return;})
				const theMsg = await theChan.messages.cache.find(ms => ms.id == messageid)
				const embed1 = new EmbedBuilder().setTitle(`**الحالة العامة للبوتات**`)
				const embed2 = new EmbedBuilder()

				const theBots = [
					{
						name:`التقديم` , defaultPrice:40,tradeName:`apply`
					},
					{
						name:`الاذكار`,defaultPrice:40,tradeName:`azkar`
					},
					{
						name:`القرأن`,defaultPrice:40,tradeName:`quran`
					},
					{
						name:`الخط التلقائي` , defaultPrice:40,tradeName:`autoline`
					},
					{
						name:`البلاك ليست` , defaultPrice:40,tradeName:`blacklist`
					},
					{
						name:`الطلبات`,defaultPrice:40,tradeName:`orders`
					},
					{
						name:`رومات الشوب`,defaultPrice:40,tradeName:`shopRooms`
					},
					{
						name:`التحكم في البرودكاست` , defaultPrice:100,tradeName:`Bc`
					},
					{
						name:`البرودكاست العادي` , defaultPrice:40,tradeName:`Broadcast2`
					},
					{
					  name:`الرومات الخاصة` , defaultPrice:70,tradeName:`privateRooms`  
					},
					{
						name:`الكريدت الوهمي` , defaultPrice:40,tradeName:`credit`
					},
					{
						name:`الاراء` , defaultPrice:40,tradeName:`feedback`
					},
					{
						name:`الجيف اواي` , defaultPrice:40,tradeName:`giveaway`
					},
					{
						name:`اللوج` , defaultPrice:40,tradeName:`logs`
					},
					{
						name:`الناديكو` , defaultPrice:40,tradeName:`nadeko`
					},
					{
						name:`البروبوت بريميوم الوهمي` , defaultPrice:40,tradeName:`probot`
					},
					{
						name:`الحماية` , defaultPrice:40 , tradeName:`protect`
					},
					{
						name:`شراء الرتب` , defaultPrice:70 , tradeName:`roles`
					},
					{
						name:`النصابين` , defaultPrice:40,tradeName:`scam`
					},
					{
						name:`الاقتراحات` , defaultPrice:40,tradeName:`suggestions`
					},
					{
						name:`السيستم` , defaultPrice:100 , tradeName:`system`
					},
					{
						name:`الضريبة` , defaultPrice:40,tradeName:`tax`
					},
					{
						name:`التكت` , defaultPrice:160,tradeName:`ticket`
					},
					{
						name:`الشوب` , defaultPrice:70,tradeName:`shop`
					},
					{
						name : `واحد للكل` , defaultPrice:200,tradeName:`one4all`
					}
				]
			theBots.forEach(async(theBot) => {
				let theBotTokens = tokens.get(theBot.tradeName) ?? 0
				let theBotStats = statuses.get(theBot.tradeName) ?? true
				embed1.addFields(
					{
						name:`**بوتات ${theBot.name} ${botStatusDB.get(theBot.tradeName) === "off" ? "🔴" : "🟢"}**` , value:`**السعر في السيرفر : \`${prices.get(theBot.tradeName+`_price_`+guild.id) ?? theBot.defaultPrice}\` عملة**\nعدد البوتات العامة : \`${theBotTokens.length ?? 0}\`` , inline:false
					}
				)
			})
			const totalSeconds = process.uptime();
	const days = Math.floor(totalSeconds / (3600 * 24)); 
	const remainingSecondsAfterDays = totalSeconds % (3600 * 24);
	const hours = Math.floor(remainingSecondsAfterDays / 3600);
	const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
	const minutes = Math.floor(remainingSecondsAfterHours / 60);
	const seconds = Math.floor(remainingSecondsAfterHours % 60);
    embed2.addFields(
        {
            name:`**تم الرفع لمدة :**` , inline:false,value:`**\`${days}\` Days,\`${hours}\` Hours , \`${minutes}\` Minutes , \`${seconds}\` Seconds  بدون انقطاع**`
        }
			)
			embed1.setColor("Random")
			embed1.setThumbnail(guild.iconURL({dynamic:true}))
			embed1.setFooter({text:guild.name , iconURL:guild.iconURL({dynamic:true})})

			embed2.setColor('Random')
			embed2.setThumbnail(guild.iconURL({dynamic:true}))
			embed2.setFooter({text:guild.name , iconURL:guild.iconURL({dynamic:true})})
		
				try {
					await theMsg.edit({embeds:[embed1 , embed2]});
				} catch {
					return;
				}
			})
			}, 60 * 1000);
		})

        client3.premiumSlashCommands = new Collection()
const premiumSlashCommands = [];
 const ascii = require('ascii-table');
const { setMaxListeners } = require("events");
const table = new ascii('Owner Commands').setJustify();
try {
	const commandsDir = path.join(__dirname, '../commands'); // Resolve the directory path
	if (!fs.existsSync(commandsDir)) {
	  throw new Error(`'../commands/' directory does not exist.`);
	}
  
	const folders = fs.readdirSync(commandsDir);
  
	for (let folder of folders.filter(folder => !folder.includes('.'))) {
	  const folderPath = path.join(commandsDir, folder);
	  const files = fs.readdirSync(folderPath);
  
	  for (let file of files.filter(f => f.endsWith('.js'))) {
		let command = require(path.join(folderPath, file));
		if (command) {
		  premiumSlashCommands.push(command.data.toJSON());
		  client3.premiumSlashCommands.set(command.data.name, command);
		  if (command.data.name) {
			table.addRow(`/${command.data.name}`, '🟢 Working');
		  } else {
			table.addRow(`/${command.data.name}`, '🔴 Not Working');
		  }
		}
	  }
	}
  } catch (err) {
	console.error("An error occurred:", err);
  }

  try {
	const eventsDir = path.join(__dirname, '../events'); // Resolve the directory path
  
	if (!fs.existsSync(eventsDir)) {
	  throw new Error(`'../events/' directory does not exist.`);
	}
  
	const folders = fs.readdirSync(eventsDir);
  
	for (let folder of folders.filter(folder => !folder.includes('.'))) {
	  const folderPath = path.join(eventsDir, folder);
	  const files = fs.readdirSync(folderPath);
  
	  for (let file of files.filter(f => f.endsWith('.js'))) {
		const event = require(path.join(folderPath, file));
		if (event.once) {
		  client3.once(event.name, (...args) => event.execute(...args));
		} else {
		  client3.on(event.name, (...args) => event.execute(...args));
		}
	  }
	}
  } catch (err) {
	console.error("An error occurred:", err);
  }

  try {
	const buttonsDir = path.join(__dirname, '../../buttons'); // Resolve the directory path
  
	if (!fs.existsSync(buttonsDir)) {
	  throw new Error(`'../../buttons/' directory does not exist.`);
	}
  
	const folders = fs.readdirSync(buttonsDir);
  
	for (let folder of folders.filter(folder => !folder.includes('.'))) {
	  const folderPath = path.join(buttonsDir, folder);
	  const files = fs.readdirSync(folderPath);
  
	  for (let file of files.filter(f => f.endsWith('.js'))) {
		const event = require(path.join(folderPath, file));
		if (event.once) {
		  client3.once(event.name, (...args) => event.execute(...args));
		} else {
		  client3.on(event.name, (...args) => event.execute(...args));
		}
	  }
	}
  } catch (err) {
	console.error("An error occurred:", err);
  }
  
client3.on('ready' , async() => {
	const subs2 = tier3subscriptions.get(`tier3_subs`);
	const sub = subs2.find(su => su.guildid == guildid)
	if(!sub) return;
	try {
		let guilds = client3.guilds.cache.forEach(async(guild) => {
		let subscriptions1 = tier3subscriptions.get(`tier3_subs`)
		if(!subscriptions1) {
			await tier3subscriptions.set(`tier3_subs` , [])
		}
		let filtered = subscriptions1.find(a => a.guildid == guild.id)
		if(!filtered) {
			if(guild.id == guildid) return;
			await guild.leave();
		}
	})
	} catch (error) {
		return
	}
	
})
client3.on("messageCreate" , async(message) => {
	const subs2 = tier3subscriptions.get(`tier3_subs`);
	const sub = subs2.find(su => su.guildid == guildid)
	if(!sub) return;
	if(message.content == `<@${client3.user.id}>`) {
		if(message.author.bot) return;
		return message.reply({content:`**Hello In <@${client3.user.id}> , Im Using / Commands**`})
	}
})
//======= -------- =========//
  //guildCreate
  client3.on("guildCreate", async (guild) => {
    const owner = await client3.users.fetch(guild.ownerId);
    const ownerUsername = owner ? owner.username : "Unknown";
    const { WebhookClient } = require('discord.js')
    const { joinLeaveWebhookUrl } = require('../../config.json');
    const webhookClient = new WebhookClient({ url : joinLeaveWebhookUrl });

    const joinsEmbed = new EmbedBuilder()
      .setTitle("Bot Maker Ultimate")
      .setColor("Purple")
      .setDescription(`Joined: ${guild.name}\nOwner Mention: <@${guild.ownerId}>\nOwner user: ${ownerUsername}\Bot name: ${client3.user.username} \nBot ID: ${client3.user.id}`);

    await webhookClient.send({ embeds: [joinsEmbed] }).catch(() => {return;});

	const subs2 = tier3subscriptions.get(`tier3_subs`);
	const sub = subs2.find(su => su.guildid == guildid)
	if(!sub) return;
	let subscriptions1 = tier3subscriptions.get(`tier3_subs`)
		let filtered = subscriptions1.find(a => a.guildid == guild.id)
		if(!filtered) {
			if(guild.id == guildid) return;
			await guild.leave();
		}

  });

  //GuildDelete
  client3.on("guildDelete", async (guild) => {
    const owner = await client3.users.fetch(guild.ownerId);
    const ownerUsername = owner ? owner.username : "Unknown";
    const { WebhookClient } = require('discord.js')
    const { joinLeaveWebhookUrl } = require('../../config.json');
    const webhookClient = new WebhookClient({ url : joinLeaveWebhookUrl });

    const joinsEmbed = new EmbedBuilder()
      .setTitle("Bot Maker Ultimate")
      .setColor("DarkPurple")
      .setDescription(`Left: ${guild.name}\nOwner Mention: <@${guild.ownerId}>\nOwner user: ${ownerUsername}\Bot name: ${client3.user.username} \nBot ID: ${client3.user.id}`);

    await webhookClient.send({ embeds: [joinsEmbed] }).catch(() => {return;});
  });

//-------

		client3.login(token).then(e => {
			currentIndex++;
			tablee.addRow(`${currentIndex}` , `${client3.user.username}` , `${client3.user.id}` , `${owner}` , `${guildid}` , `${prettySeconds(timeleft)}` , `🟢 ONLINE`)
		})
		.catch(err => {
			currentIndex++;
			tablee.addRow(`${currentIndex}` , `Undefined` , `Undefined` , `${owner}` , `${guildid}` , `${prettySeconds(timeleft)}` , `🔴 OFFLINE`)
		});
})

setTimeout(async() => {
	console.log(tablee.toString())
}, 35_000);