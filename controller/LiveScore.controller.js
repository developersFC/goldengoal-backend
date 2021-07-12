const { default: axios } = require('axios');

const liveScore = (req, res) => {
    const { nameFav } = req.query;
    var options = {
        method: 'GET',
        url: 'https://api-football-beta.p.rapidapi.com/fixtures',
        params: {live: 'all',nameFav:nameFav},
        headers: {
          'x-rapidapi-key': 'd6359ff69dmshc572b5cf8548b1dp19eee8jsnf40e089d1a6f',
          'x-rapidapi-host': 'api-football-beta.p.rapidapi.com'
        }
      };
      
    axios.request(options).then(function (response) {
        console.log(response.data.response);
        for (let i = 0; i < response.length; i++) {
            if (response[i].teams.home.name === nameFav || response[i].teams.away.name === nameFav  ) {
                let score = {
                    team: response[i].teams.home.name,
                    team2: response[i].teams.away.name,
                    teamGoal: response[i].goals.home,
                    team2Goal: response[i].goals.away,
                    time: response[i].fixture.status.elapsed,
         
                }
                res.send(response)
                console.log(score);
            } else {
                console.error("error");
            }

        }


    }).catch(function (error) {
        console.error(error);
    });
}
module.exports = liveScore;