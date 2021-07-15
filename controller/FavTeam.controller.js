const { default: axios } = require('axios');

const teamModel = require('../model/Team.model');



const getTeams = (req, res) => {
  teamModel.find({}, (err, teams) => {
    if (err) res.send(err);
    let teamIds = [];
    teamIds = teams.map((team) => {
      return team.id;
    });
    res.send(teamIds);
  });
};

const getFavTeam = (req, res) => {
  const { name } = req.query;
  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/teams',
    params: { name: name },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY12,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };
  axios
    .request(options)
    .then((response) => {
      let team = response.data.response[0].team;
      teamModel.findOne({ id: team.id }, (err, favTeam) => {
        favTeam.id = team.id;
        favTeam.name = team.name;
        favTeam.logo = team.logo;
        favTeam.save();
      });
      res.send(team);
    })
    .catch((error) => {
      res.send({
        error: error,
        errorMessage:
          'Whoops, couldnt find a team with that name, check the spelling and try again',
      });
    });
};
// const getFavTeam = (req, res) => {
//   const { name } = req.query;

//   let options = {
//     method: 'GET',
//     url: 'https://api-football-beta.p.rapidapi.com/teams',
//     params: { name: name },
//     headers: {
//       'x-rapidapi-key': process.env.X_RAPIDAPI_KEY1,
//       'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
//     },
//   };

//   axios
//     .request(options)
//     .then((response) => {
//       let team = response.data.response[0].team;
//       team = new teamModel({ id: team.id, name: team.name, logo: team.logo });
//       team.save();
//       res.send(team);
//     })
//     .catch((error) => {
//       res.send({
//         error: error,
//         errorMessage:
//           'Whoops, couldnt find a team with that name, check the spelling and try again',
//       });
//     });
// };

const getLeagueFav = (req, res) => {
  teamModel.find({}, (err, teams) => {
    if (err) res.send(err);

    Promise.all(
      teams.map(async (team) => {
        let options = {
          method: 'GET',
          url: 'https://api-football-beta.p.rapidapi.com/leagues',
          params: { season: '2020', type: 'league', team: team.id },
          headers: {
            'x-rapidapi-key': process.env.X_RAPIDAPI_KEY12,
            'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
          },
        };

        await axios
          .request(options)
          .then((response) => {
            team.league = response.data.response[0].league.id;
            team.save();
          })
          .catch((error) => {
            res.send(error);
          });
      })
    )
      .then(() => {
        res.send(teams);
      })
      .catch((error) => {
        res.send(error);
      });
  });
};

const getStandingFav = (req, res) => {
  let standing = new Array();

  teamModel.find({}, (err, teams) => {
    Promise.all(
      teams.map(async (team) => {
        let options = {
          method: 'GET',
          url: 'https://api-football-beta.p.rapidapi.com/standings',
          params: { season: '2020', league: team.league },
          headers: {
            'x-rapidapi-key': process.env.X_RAPIDAPI_KEY12,
            'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
          },
        };

        await axios
          .request(options)
          .then((response) => {
            standing = response.data.response[0].league.standings[0].map(
              (team) => {
                return {
                  rank: team.rank,
                  name: team.team.name,
                  id: team.team.id,
                  points: team.points,
                };
              }
            );
          })
          .catch((error) => {
            res.send(error);
          });
      })
    )
      .then(() => {
        res.send(standing);
      })
      .catch((error) => {
        res.send(error);
      });
  });
};

const getMatchesFav = (req, res) => {
  const { teamId } = req.query;
  const d = new Date();

  let options = {
    method: 'GET',
    url: 'https://api-football-beta.p.rapidapi.com/fixtures',
    params: {
      team: teamId,
      season: '2021',
    },
    headers: {
      'x-rapidapi-key': process.env.X_RAPIDAPI_KEY1,
      'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
    },
  };

  Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  const getDates = (startDate, stopDate) => {
    let dateArray = new Array();
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  };

  let dateArray = getDates(new Date(), new Date().addDays(30));

  axios
    .request(options)
    .then((response) => {
      let upcoming = new Array();
      response.data.response.map((fixture) => {
        fixture.fixture.date = new Date(fixture.fixture.date);
        dateArray.map((date) => {
          if (
            fixture.fixture.date.getFullYear() === date.getFullYear() &&
            fixture.fixture.date.getMonth() === date.getMonth() + 1 &&
            fixture.fixture.date.getDate() === date.getDate() + 1
          ) {
            upcoming.push({
              date: fixture.fixture.date,
              league: fixture.league.name,
              homeTeam: fixture.teams.home.name,
              awayTeam: fixture.teams.away.name,
            });
          }
        });
      });
      res.send(upcoming);
    })
    .catch((error) => {
      res.send(error);
    });
};

const deleteTeam = (req, res) => {
  const { teamId } = req.query;

  teamModel.findOne({ id: teamId }, (err, team) => {
    if (err) return res.send(err);
    if (team === null || team === undefined) res.send('Team does not exist');
  });

  teamModel.deleteOne({ id: teamId }, (err) => {
    if (err) return res.send(err);
    res.send('deleted');
  });
};

module.exports = {
  getTeams,
  getFavTeam,
  getLeagueFav,
  getStandingFav,
  getMatchesFav,
  deleteTeam,
};
