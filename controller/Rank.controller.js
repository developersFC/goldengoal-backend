const { default: axios } = require('axios');
require('dotenv').config();
const teamModel = require('../model/Team.model');

let leagues = [];
let standings = [];
let favTeams = [];

const getLeague = (req, res) => {
  const { code } = req.query;

  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/leagues',
    params: { code: code, type: 'league' },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      let data = response.data.response;
      leagues = data.map((league) => {
        return { name: league.league.name, id: league.league.id };
      });
      res.send(leagues);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const getStandings = (req, res) => {
  const { league } = req.query;

  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/standings',
    params: { season: '2021', league: league },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      let data = response.data.response[0].league.standings[0];
      standings = data.map((team) => {
        return { name: team.team.name, id: team.team.id };
      });
      res.send(standings);
    })
    .catch(function (error) {
      console.error(error);
    });
};

const getTeam = (req, res) => {
  const { id, league } = req.query;

  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/teams',
    params: { id: id, league: league, season: '2021' },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      let data = response.data.response;
      favTeams = data.map((team) => {
        return new { name: team.team.name, id: team.team.id }();
      });
      res.send(standings);
    })
    .catch(function (error) {
      console.error(error);
    });
};

module.exports = { getLeague, getStandings, getTeam };
