const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
});

const teamModel = mongoose.model('teamModel', teamSchema);

module.exports = teamModel;
