const { EmbedBuilder } = require('discord.js');
const LolApiCaller = require('./lol-api-caller');

const MessageBuilder = {
    getSummonerSearchResult: async (summonName, messageAuthor) => {
        const summonerInfo = await LolApiCaller.getSummonerByName(summonName);

        // 소환사명이 존재 하지 않는 경우
        if (summonerInfo == null) {
            const result = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle(`${summonName} 는 존재하지 않는 소환사명입니다.`)

            return result;
        } else {
            const leagueInfo = await LolApiCaller.getRankGameByEncryptId(summonerInfo.id);

            const result = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle(`${summonName} 소환사 님의 정보`)
                .setDescription(`[ ${messageAuthor} ]`)
                .addFields(
                    { 
                        name: '티어 정보', 
                        value: `${leagueInfo.tier} ${rankConverter(leagueInfo.rank)} | ${leagueInfo.leaguePoints}LP`,
                    },
                    {
                        name: '승/패 | 승률', 
                        value: `${leagueInfo.wins}승 ${leagueInfo.losses}패 | ${Number(Number(leagueInfo.wins) / (Number(leagueInfo.losses) + Number(leagueInfo.wins)) * 100).toFixed(2)}%`,
                    }
                )
                .setFooter({ text: `${leagueInfo.queueType == 'RANKED_SOLO_5x5' ? '솔로랭크 기준 티어입니다.' : '자유랭크 기준 티어입니다.'}` });

            return result;
        }
    }
}

function rankConverter(rank) {
    if (rank == 'I')
        return 1;
    else if (rank == 'II') {
        return 2;
    }
    else if (rank == 'III') {
        return 3;
    }
    else if (rank == 'VI') {
        return 4;
    }
}

module.exports = MessageBuilder