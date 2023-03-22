const axios = require('axios');
const Dotenv = require('dotenv');
Dotenv.config();

const Caller = {
    getSummonerByName: async (summonName) => {
        try {
            const result = await axios({
                url: `${process.env.RIOT_API_URL}/lol/summoner/v4/summoners/by-name/${summonName}`,
                method: 'GET',
                headers: {
                    "X-Riot-Token": process.env.RIOT_API_KEY
                }
            });

            return result.data;

        } catch (err) {
            return null;
        }
    },
    getRankGameByEncryptId: async (encId) => {
        const axiosResult = await axios({
            url: `${process.env.RIOT_API_URL}/lol/league/v4/entries/by-summoner/${encId}`,
            method: 'GET',
            headers: {
                "X-Riot-Token": process.env.RIOT_API_KEY
            }
        });

        const result = {
            solo: axiosResult.data.find(item => item.queueType === 'RANKED_SOLO_5x5'),
            flex: axiosResult.data.find(item => item.queueType === 'RANKED_FLEX_SR'),
        };

        return result;
    },
    getChampionListByEncryptId: async (encId, topCount) => {
        const axiosResult = await axios({
            url: `${process.env.RIOT_API_URL}/lol/champion-mastery/v4/champion-masteries/by-summoner/${encId}/top?count=${topCount}`,
            method: 'GET',
            headers: {
                "X-Riot-Token": process.env.RIOT_API_KEY
            }
        });

        return axiosResult.data;
    },
    getChampionJson: async () => {
        const axiosResult = await axios({
            url: `https://ddragon.leagueoflegends.com/cdn/13.6.1/data/ko_KR/champion.json`,
            method: 'GET',
        });

        return axiosResult.data.data;
    }
}

module.exports = Caller