const { EmbedBuilder } = require('discord.js');
const LolApiCaller = require('./lol-api-caller');

const MessageBuilder = {
    getSummonerSearchResult: async (summonName, messageAuthor) => {
        // 특정 특수문자 입력시 존재하지 않는 소환사로 처리
        const regex1 = /;/gi;
        if (regex1.test(summonName)) {
            const result = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle(`${summonName} 는 존재하지 않는 소환사명입니다.`)

            return result;
        }

        const summonerInfo = await LolApiCaller.getSummonerByName(summonName);
        console.log(summonerInfo);

        // 소환사명이 존재 하지 않는 경우
        if (summonerInfo == null) {
            const result = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle(`${summonName} 는 존재하지 않는 소환사명입니다.`)

            return result;
        } else {
            const leagueInfo = await LolApiCaller.getRankGameByEncryptId(summonerInfo.id);
            const soloRankInfo = leagueInfo.solo;
            const flexRankInfo = leagueInfo.flex;

            console.log(leagueInfo);

            const result = new EmbedBuilder()
                .setColor(0xFF9900)
                .setTitle(`${summonName} 소환사 님의 정보`)
                .setDescription(`[ ${messageAuthor} ]`)
                // .setThumbnail(`https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_${leagueInfo.tier}.png?raw=true`)
                
                .setFooter({ text: `@developed by GuMin` });

            if (soloRankInfo != null) {
                result.addFields(
                    { 
                        name: `솔로 랭크 | ${soloRankInfo.tier} ${rankConverter(soloRankInfo.rank)} | ${soloRankInfo.leaguePoints}LP`, 
                        value: `${soloRankInfo.wins}승 ${soloRankInfo.losses}패 | ${Number(Number(soloRankInfo.wins) / (Number(soloRankInfo.losses) + Number(soloRankInfo.wins)) * 100).toFixed(2)}%`,
                    }
                )
            }

            if (flexRankInfo != null) {
                result.addFields(
                    {
                        name: `자유 랭크 | ${flexRankInfo.tier} ${rankConverter(flexRankInfo.rank)} | ${flexRankInfo.leaguePoints}LP`, 
                        value: `${flexRankInfo.wins}승 ${flexRankInfo.losses}패 | ${Number(Number(flexRankInfo.wins) / (Number(flexRankInfo.losses) + Number(flexRankInfo.wins)) * 100).toFixed(2)}%`,
                    }
                )
            }

            // 티어 이미지 추가
            if (soloRankInfo != null && flexRankInfo != null) {

                console.log(compareTier(soloRankInfo.tier, flexRankInfo.tier) );

                if (compareTier(soloRankInfo.tier, flexRankInfo.tier) == 'solo') {
                    if (soloRankInfo.rank == 'IRON') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_IRON.png?raw=true');
                    } else if (soloRankInfo.tier == 'BRONZE') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_BRONZE.png?raw=true');
                    } else if (soloRankInfo.tier == 'SILVER') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_SILVER.png?raw=true');
                    } else if (soloRankInfo.tier == 'GOLD') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_GOLD.png?raw=true');
                    } else if (soloRankInfo.tier == 'PLATINUM') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_PLATINUM.png?raw=true');
                    } else if (soloRankInfo.tier == 'DIAMOND') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DIAMOND.png?raw=true');
                    } else if (soloRankInfo.tier == 'MASTER') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_MASTER.png?raw=true');
                    } else if (soloRankInfo.tier == 'GRANDMASTER') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_GRANDMASTER.png?raw=true');
                    } else if (soloRankInfo.tier == 'CHALLENGER') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_CHALLENGER.png?raw=true');
                    } else {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DEFAULT.png?raw=true');
                    }
                } else {
                    if (flexRankInfo.tier == 'IRON') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_IRON.png?raw=true');
                    } else if (flexRankInfo.tier == 'BRONZE') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_BRONZE.png?raw=true');
                    } else if (flexRankInfo.tier == 'SILVER') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_SILVER.png?raw=true');
                    } else if (flexRankInfo.tier == 'GOLD') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_GOLD.png?raw=true');
                    } else if (flexRankInfo.tier == 'PLATINUM') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_PLATINUM.png?raw=true');
                    } else if (flexRankInfo.tier == 'DIAMOND') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DIAMOND.png?raw=true');
                    } else if (flexRankInfo.tier == 'MASTER') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_MASTER.png?raw=true');
                    } else if (flexRankInfo.tier == 'GRANDMASTER') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_GRANDMASTER.png?raw=true');
                    } else if (flexRankInfo.tier == 'CHALLENGER') {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_CHALLENGER.png?raw=true');
                    } else {
                        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DEFAULT.png?raw=true');
                    }
                }
            } else if (soloRankInfo == null && flexRankInfo != null) {
                if (flexRankInfo.tier == 'IRON') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_IRON.png?raw=true');
                } else if (flexRankInfo.tier == 'BRONZE') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_BRONZE.png?raw=true');
                } else if (flexRankInfo.tier == 'SILVER') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_SILVER.png?raw=true');
                } else if (flexRankInfo.tier == 'GOLD') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_GOLD.png?raw=true');
                } else if (flexRankInfo.tier == 'PLATINUM') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_PLATINUM.png?raw=true');
                } else if (flexRankInfo.tier == 'DIAMOND') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DIAMOND.png?raw=true');
                } else if (flexRankInfo.tier == 'MASTER') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_MASTER.png?raw=true');
                } else if (flexRankInfo.tier == 'GRANDMASTER') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_GRANDMASTER.png?raw=true');
                } else if (flexRankInfo.tier == 'CHALLENGER') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_CHALLENGER.png?raw=true');
                } else {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DEFAULT.png?raw=true');
                }
            } else if (soloRankInfo != null && flexRankInfo == null) {
                if (soloRankInfo.rank == 'IRON') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_IRON.png?raw=true');
                } else if (soloRankInfo.tier == 'BRONZE') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_BRONZE.png?raw=true');
                } else if (soloRankInfo.tier == 'SILVER') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_SILVER.png?raw=true');
                } else if (soloRankInfo.tier == 'GOLD') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_GOLD.png?raw=true');
                } else if (soloRankInfo.tier == 'PLATINUM') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_PLATINUM.png?raw=true');
                } else if (soloRankInfo.tier == 'DIAMOND') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DIAMOND.png?raw=true');
                } else if (soloRankInfo.tier == 'MASTER') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_MASTER.png?raw=true');
                } else if (soloRankInfo.tier == 'GRANDMASTER') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_GRANDMASTER.png?raw=true');
                } else if (soloRankInfo.tier == 'CHALLENGER') {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_CHALLENGER.png?raw=true');
                } else {
                    result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DEFAULT.png?raw=true');
                }
            } else {
                result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DEFAULT.png?raw=true');
            }

            return result;
        }
    }
}

function compareTier(solo, flex) {
    const tier = {
        'IRON': 1,
        'BRONZE': 2,
        'SILVER': 3,
        'GOLD': 4,
        'PLATINUM': 5,
        'DIAMOND': 6,
        'MASTER': 7,
        'GRANDMASTER': 8,
        'CHALLENGER': 9,
    };

    if (tier[solo] > tier[flex]) {
        return 'solo';
    } else if (tier[solo] < tier[flex]) {
        return 'flex';
    } else {
        return 'solo';
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
    else if (rank == 'IV') {
        return 4;
    }
}

module.exports = MessageBuilder