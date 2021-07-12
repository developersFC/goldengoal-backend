const { default: axios } = require('axios');
require('dotenv').config();
const teamModel = require('../model/Team.model');

let favTeamStandings = [];

const getFavTeam = (req, res) => {
  const { name } = req.query;

  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/teams',
    params: { name: name },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_3,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  axios
    .request(options)
    .then((response) => {
      let team = response.data.response[0].team;
      team = new teamModel({ id: team.id, name: team.name, logo: team.logo });
      team.save();
      res.send(team);
    })
    .catch(function (error) {
      res.send([
        error,
        'Error,Something happend,you probably got the name wrong',
      ]);
    });
};

const getLeagueFav = (req, res) => {
  let leagues = [];

  teamModel.find({}, (err, teams) => {
    err ? res.send(err) : 0;

    console.log(teams);

    teams.map((team) => {
      let options = {
        method: 'GET',
        url: 'https://api-football-beta.p.rapidapi.com/leagues',
        params: { season: '2020', type: 'league', team: team.id },
        headers: {
          'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_3,
          'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
        },
      };

      axios
        .request(options)
        .then(function (response) {
          leagues.push(response.data.response[0].league);
        })
        .catch(function (error) {
          console.error(error);
        });
    });
  });
};

const getStandingFav = (res, req) => {
  const { leagues } = req.query;

  leagues.map((league) => {
    let options = {
      method: 'GET',
      url: 'https://api-football-beta.p.rapidapi.com/standings',
      params: { season: '2020', league: league.id },
      headers: {
        'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_3,
        'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        let data = response.data.response[0].league.standings[0];
        data = data.map((team) => {
          return {
            rank: team.rank,
            name: team.team.name,
            id: team.team.id,
            points: team.points,
          };
        });
        res.send(data);
      })
      .catch(function (error) {
        console.error(error);
      });
  });
};

module.exports = { getFavTeam, getLeagueFav, getStandingFav };
