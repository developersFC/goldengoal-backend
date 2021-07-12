const { default: axios } = require('axios');

const liveScore = (req, res) => {
    const { nameFav } = req.query;
    let options = {
        method: 'GET',
        url: 'https://livescore6.p.rapidapi.com/matches/v2/list-live',
        params: { Category: 'soccer', nameFav: nameFav },
        headers: {
            'x-rapidapi-key': 'd6359ff69dmshc572b5cf8548b1dp19eee8jsnf40e089d1a6f',
            'x-rapidapi-host': 'livescore6.p.rapidapi.com'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data.Stages.length);
        for (let i = 0; i < response.data.Stages.length; i++) {
            if (response.data.Stages[i].Events[i].T1[0].Nm === nameFav  || response.data.Stages[i].Events[i].T2[0].Nm  ===  nameFav) {
                let score = {
                    team: response.data.Stages[i].Events[i].T2[i].Nm,
                    team2: response.data.Stages[i].Events[i].T1[i].Nm,
                    teamGoal: response.data.Stages[i].Events[i].T2[i].Gd,
                    team2Goal: response.data.Stages[i].Events[i].T1[i].Gd,
                    time: response.data.Stages[i].Events[i].Eps,
                    logoTeam1: response.data.Stages[i].Events[i].T2[i].Img,
                    logoTeam2: response.data.Stages[i].Events[i].T1[i].Img
                }
                res.send(score)
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