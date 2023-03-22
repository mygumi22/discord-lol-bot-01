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
    getSoloRankInfoByEncryptId: async (encId) => {

    },
    get5on5RankInfoByEncryptId: async (encId) => {

    },
}

module.exports = Caller