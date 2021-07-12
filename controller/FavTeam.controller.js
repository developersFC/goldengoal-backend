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
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_4,
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

    Promise.all(
      teams.map(async (team) => {
        let options = {
          method: 'GET',
          url: 'https://api-football-beta.p.rapidapi.com/leagues',
          params: { season: '2020', type: 'league', team: team.id },
          headers: {
            'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_4,
            'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
          },
        };

        await axios
          .request(options)
          .then(function (response) {
            team.league = response.data.response[0].league.id;
            team.save();
          })
          .catch(function (error) {
            console.error(error);
          });
      })
    )
      .then(() => {
        res.send(teams);
      })
      .catch(function (error) {
        console.error(error);
      });
  });
};

const getStandingFav = (res, req) => {
  let standing = [];

  teamModel.find({}, (err, teams) => {
    Promise.all(
      teams.map(async (team) => {
        let options = {
          method: 'GET',
          url: 'https://api-football-beta.p.rapidapi.com/standings',
          params: { season: '2020', league: team.league },
          headers: {
            'x-rapidapi-key': process.env.X_RAPIDAPI_KEY_4,
            'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
          },
        };

        await axios
          .request(options)
          .then(function (response) {
            let data = response.data.response[0].league.standings[0];
            standing = data.map((team) => {
              return {
                rank: team.rank,
                name: team.team.name,
                id: team.team.id,
                points: team.points,
              };
            });
          })
          .catch(function (error) {
            console.error(error);
          });
      })
    )
      .then(() => {
        console.log(standing);
      })
      .catch(function (error) {
        console.error(error);
      });
  });
};

module.exports = { getFavTeam, getLeagueFav, getStandingFav };
