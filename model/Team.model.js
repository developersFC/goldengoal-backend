const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  logo: { type: String },
  league: { type: String },
});

const teamModel = mongoose.model('teamModel', teamSchema);

module.exports = teamModel;
