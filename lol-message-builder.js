const { EmbedBuilder } = require('discord.js');
const LolApiCaller = require('./lol-api-caller');

const MessageBuilder = {
  getBotDescriptionMessage: async () => {
    const result = `안녕하세요😄\n동산교회 게이머를 위한 롤 전적검색 봇입니다.\n\n` + 
		`해당 봇은 RIOT GAMES에서 제공하는 API를 사용하여 원하는 사용자의 정보를 조회하고 있습니다.\n` +
		`무료로 해당 API를 사용하고 있어 1sec per 최대 5번, 1min per 약 12번 정도의 사용자 정보를 조회할 수 있습니다👻\n` +
		`너무 과도한 요청을 보낼 시 개발자가 상당히 슬퍼지니 이 점 유의하여서 봇을 이용해주시기 바랍니다💛\n\n` +
		`기타 궁금한 내용이 있으신 경우 개발자(nimug)에게 문의해주세요😨`;

    return result;
  },

	getCommandDescriptionMessage: async () => {
		const result = `🔔 명령어 정리\n\n` +
		`$설명 : 봇에 대한 기본 설명을 제공합니다.\n` +
		`$명령어 : 봇이 제공하고 있는 명령어에 대해 설명합니다.\n` +
		`$소환사 {소환사명} : 소환사의 솔로랭크 / 자유랭크 정보를 제공합니다.`;

    return result;
	},

  getSummonerSearchResult: async (summonName, messageAuthor) => {
    // 특정 특수문자 입력시 존재하지 않는 소환사로 처리
    const regex1 = /;/gi;
    if (regex1.test(summonName)) {
      const result = new EmbedBuilder().setColor(0xff9900).setTitle(`${summonName} 는 존재하지 않는 소환사명입니다.`);

      return result;
    }

    // 소환사 기본정보 조회
    const summonerInfo = await LolApiCaller.getSummonerByName(summonName);

    // 소환사명이 존재 하지 않는 경우
    if (summonerInfo == null) {
      const result = new EmbedBuilder().setColor(0xff9900).setTitle(`${summonName} 는 존재하지 않는 소환사명입니다.`);

      return result;
    } else {
      // 랭크 정보 조회
      const leagueInfo = await LolApiCaller.getRankGameByEncryptId(summonerInfo.id);
      const soloRankInfo = leagueInfo.solo;
      const flexRankInfo = leagueInfo.flex;

      // LOL 챔피언 JSON 가져오기
      const LOL_CHAMPION_LIST = await LolApiCaller.getChampionJson();
      const ARR_LOL_CHAMPION = Object.keys(LOL_CHAMPION_LIST).map((key) => LOL_CHAMPION_LIST[key]);

      // 소환사의 MOST 5 챔피언 정보 조회
      const summonersChampionList = await LolApiCaller.getChampionListByEncryptId(summonerInfo.id, 5);

      // Embed Message 생성
      const result = new EmbedBuilder()
        .setColor(0xff9900)
        .setTitle(`${summonName} 소환사 님의 정보`)
        .setDescription(`[ ${messageAuthor} ]`)
        .setFooter({ text: `@developed by nimug` });

      if (soloRankInfo != null) {
        result.addFields({
          name: `솔로 랭크 | ${soloRankInfo.tier} ${rankConverter(soloRankInfo.rank)} | ${soloRankInfo.leaguePoints}LP`,
          value: `${soloRankInfo.wins}승 ${soloRankInfo.losses}패 | ${Number(
            (Number(soloRankInfo.wins) / (Number(soloRankInfo.losses) + Number(soloRankInfo.wins))) * 100
          ).toFixed(2)}%`,
        });
      }

      if (flexRankInfo != null) {
        result.addFields({
          name: `자유 랭크 | ${flexRankInfo.tier} ${rankConverter(flexRankInfo.rank)} | ${flexRankInfo.leaguePoints}LP`,
          value: `${flexRankInfo.wins}승 ${flexRankInfo.losses}패 | ${Number(
            (Number(flexRankInfo.wins) / (Number(flexRankInfo.losses) + Number(flexRankInfo.wins))) * 100
          ).toFixed(2)}%`,
        });
      }

      // 모스트 1 챔피언
      result.addFields({
        name: `모스트 챔피언 | ${ARR_LOL_CHAMPION.find((item) => item.key == summonersChampionList[0].championId).name}`,
        value: `Proficiency Level: ${summonersChampionList[0].championLevel}.Lv / Champion Point: ${summonersChampionList[0].championPoints}pt`,
      });

      // OP.GG 검색하기
      result.addFields({
        name: `OP.GG 에서 소환사 정보 검색하기`,
        value: `https://www.op.gg/summoners/kr/${summonName}`,
      });

      // 티어 이미지 추가
      if (soloRankInfo != null && flexRankInfo != null) {
        if (compareTier(soloRankInfo.tier, flexRankInfo.tier) == 'solo') {
          result.setThumbnail(
            `https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_${soloRankInfo.tier}.png?raw=true`
          );
        } else {
          result.setThumbnail(
            `https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_${flexRankInfo.tier}.png?raw=true`
          );
        }
      } else if (soloRankInfo == null && flexRankInfo != null) {
        result.setThumbnail(
          `https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_${flexRankInfo.tier}.png?raw=true`
        );
      } else if (soloRankInfo != null && flexRankInfo == null) {
        result.setThumbnail(
          `https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_${soloRankInfo.tier}.png?raw=true`
        );
      } else {
        result.setThumbnail('https://github.com/mygumi22/discord-lol-bot-01/blob/master/public/images/Emblem_DEFAULT.png?raw=true');
      }

      return result;
    }
  },
};

// 솔로랭크, 자유랭크 중 높은 티어 비교
function compareTier(solo, flex) {
  const tier = {
    IRON: 1,
    BRONZE: 2,
    SILVER: 3,
    GOLD: 4,
    PLATINUM: 5,
    DIAMOND: 6,
    MASTER: 7,
    GRANDMASTER: 8,
    CHALLENGER: 9,
  };

  if (tier[solo] > tier[flex]) {
    return 'solo';
  } else if (tier[solo] < tier[flex]) {
    return 'flex';
  } else {
    return 'solo';
  }
}

// 랭크 로마숫자에서 아라비아 숫자로 변경
function rankConverter(rank) {
  if (rank == 'I') return 1;
  else if (rank == 'II') {
    return 2;
  } else if (rank == 'III') {
    return 3;
  } else if (rank == 'IV') {
    return 4;
  }
}

module.exports = MessageBuilder;
