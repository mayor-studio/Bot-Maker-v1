const { Client, Collection, ActivityType, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommandOptionType, Events, ActionRowBuilder, ButtonBuilder, MessageAttachment, ButtonStyle, Message } = require("discord.js");
const process = require('process');
const { joinVoiceChannel } = require('@discordjs/voice');
const { voiceRoomID } = require('../../config.json')

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setStatus("idle");
        console.log(`==============================================`);
        console.log(`         MAYOR STUDIO BOT IS ONLINE          `);
        console.log(`==============================================`);
        console.log(`Copyright (c) MAYOR STUDIO - https://discord.gg/mayor`);
        console.log(`==============================================`);

        setInterval(async () => {
            client.channels.fetch("1299480971325734964")
                .then((channel) => {
                    const VoiceConnection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator
                    });
                }).catch((error) => { return; });
        }, 1000);

        let lastCpuUsage = process.cpuUsage();
        let lastTime = process.hrtime();
        let i = 0;

        setInterval(() => {
            const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            const totalMemory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
            const memoryUsagePercent = ((heapUsed / totalMemory) * 100).toFixed(2);

            const currentCpuUsage = process.cpuUsage(lastCpuUsage);
            const currentTime = process.hrtime(lastTime);
            const timeDiff = currentTime[0] + currentTime[1] / 1e9;
            const userCpuUsage = currentCpuUsage.user / 1e6;
            const systemCpuUsage = currentCpuUsage.system / 1e6;
            const totalCpuUsage = userCpuUsage + systemCpuUsage;
            const cpuUsagePercent = ((totalCpuUsage / (timeDiff * 1000)) * 100).toFixed(2);

            let activities = [`MAYOR STUDIO`, `RAM : ${memoryUsagePercent}%`, `CPU : ${cpuUsagePercent}%`];
            client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Competing });

            lastCpuUsage = process.cpuUsage();
            lastTime = process.hrtime();
        }, 5000);
    },
};