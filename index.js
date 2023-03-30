const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Dotenv = require('dotenv');
const logger = require('./logger');
const LolMessageBuilder = require('./lol-message-builder');

Dotenv.config();

logger.info(`Start server`);

//* Logger 샘플
// logger.info("hello world");
// logger.error("hello world");
// logger.warn("hello world");
// logger.debug("hello world");
// logger.verbose("hello world");
// logger.silly("hello world");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});


client.once(Events.ClientReady, c => {
    logger.info(`Chat bot ready! Logged in as [${c.user.tag}]`);
});

// 사용자가 메시지를 보냈을 때
client.on(Events.MessageCreate, async msg => {
    if (msg.author.bot) return;

    // 전적 검색 채널에 메시지가 입력되었을 때
    if (msg.channel.name == '전적검색') {
        // 봇 설명
        if (msg.content.startsWith('!설명')) {
            logger.info(`설명 호출`);
        }

        // 소환사 정보 검색
        if (msg.content.startsWith('!소환사')) {
            logger.info(`[${msg.author}] 소환사 정보 검색 - 소환사명 : [${msg.content.split('!소환사 ')[1]}]`);
            const embedMessage = await LolMessageBuilder.getSummonerSearchResult(msg.content.split('!소환사 ')[1], msg.author);
            msg.channel.send({ embeds: [embedMessage] });
        }
    }
});



client.login(process.env.BOT_TOKEN);