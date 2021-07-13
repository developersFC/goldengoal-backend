const { default: axios } = require('axios');

const getLeague = (req, res) => {
  const { code } = req.query;

  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/leagues',
    params: { code: code, type: 'league' },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_5,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  axios
    .request(options)
    .then((response) => {
      let leagues = response.data.response.map((league) => {
        return { name: league.league.name, id: league.league.id };
      });

      res.send(leagues);
    })
    .catch((error) => {
      res.send(error);
    });
};

const getStandings = (req, res) => {
  const { league } = req.query;

  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/standings',
    params: { season: '2020', league: league },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_5,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  axios
    .request(options)
    .then((response) => {
      let standings = response.data.response[0].league.standings[0].map(
        (team) => {
          return {
            rank: team.rank,
            name: team.team.name,
            id: team.team.id,
            points: team.points,
          };
        }
      );
      res.send(standings);
    })
    .catch((error) => {
      res.send(error);
    });
};

module.exports = { getLeague, getStandings };
