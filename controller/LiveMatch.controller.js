const { default: axios } = require('axios');

const getLiveMatches = (req, res) => {
  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/fixtures',
    params: { live: 'all' },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_5,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  axios
    .request(options)
    .then((response) => {
      let matches = new Array();
      response.data.response.map((match) => {
        // res.send(match);
        matches.push({
          half: match.fixture.status.long,
          elapsed: match.fixture.status.elapsed,
          league: match.league.name,
          home: match.teams.home.name,
          away: match.teams.away.name,
          homeGoals: match.goals.home,
          awayGoals: match.goals.away,
        });
      });
      res.send(matches);
    })
    .catch((error) => {
      res.send(error);
    });
};

module.exports = { getLiveMatches };
