const { default: axios } = require('axios');
require('dotenv').config();
const teamModel = require('../model/Team.model');

let favTeamStandings = [];

const getTeam = (req, res) => {
  const { name } = req.query;

  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/teams',
    params: { name: name },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_2,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      let team = response.data.response[0].team;
      team = new teamModel({ id: team.id, name: team.name, logo: team.logo });
      team.save();
      getLeagueFav(req, res, team);
    })
    .catch(function (error) {
      res.send([
        error,
        'Error,Something happend,you probably got the name wrong',
      ]);
    });

  const getLeagueFav = (req, res, team) => {
    let options = {
      method: 'GET',
      url: 'https://api-football-beta.p.rapidapi.com/leagues',
      params: { type: 'league', team: team.id },
      headers: {
        'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_2,
        'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        let league = response.data.response[0].league;
        getStandingFav(req, res, league);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const getStandingFav = (req, res, league) => {
    var options = {
      method: 'GET',
      url: 'https://api-football-beta.p.rapidapi.com/standings',
      params: { season: '2020', league: league.id },
      headers: {
        'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_2,
        'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        let data = response.data.response[0].league.standings[0];
        let favTeamStandings = data.map((team) => {
          return {
            rank: team.rank,
            name: team.team.name,
            id: team.team.id,
            points: team.points,
          };
        });
        res.send(favTeamStandings);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
};

module.exports = { getTeam };
