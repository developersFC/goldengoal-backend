require('dotenv').config();
const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
// const jwksClient = require('jwks-rsa');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

const {
  getLeague,
  getStandings,
  getTeam,
} = require('./controller/Rank.controller');

// mongoose.connect(
//   `mongodb+srv://saif:goldengoal@cluster0.kgujx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   console.log('Connected :)');
// });

// const client = jwksClient({
//   jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
// });

// const getKey = (header, callback) => {
//   client.getSigningKey(header.kid, function (err, key) {
//     const signingKey = key.publicKey || key.rsaPublicKey;
//     callback(null, signingKey);
//   });
// };

// app.get('/authorize', (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   jwt.verify(token, getKey, {}, (err, user) => {
//     if (err) {
//       res.send('invalid token');
//     }
//     res.send(user);
//   });
//   res.send(token);
// });

app.get('/leagues', getLeague);
app.get('/rank', getStandings);
app.get('/team', getStandings);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
