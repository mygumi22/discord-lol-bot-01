const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Dotenv = require('dotenv');
const LolMessageBuilder = require('./lol-message-builder');

Dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as [${c.user.tag}]`);
});

// 사용자가 메시지를 보냈을 때
client.on(Events.MessageCreate, async msg => {
    if (msg.author.bot) return;

    // 전적 검색 채널에 메시지가 입력되었을 때
    if (msg.channel.name == '전적검색') {
        const embedMessage = await LolMessageBuilder.getSummonerSearchResult(msg.content, msg.author);
        msg.channel.send({ embeds: [embedMessage] });
    }

    // msg.reply(`입력을 받았습니다`);
});



client.login(process.env.BOT_TOKEN);