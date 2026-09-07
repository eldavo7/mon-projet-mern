// server/models/Planning.js
const mongoose = require('mongoose');

const planningSchema = new mongoose.Schema({}, { strict: false, collection: 'planningProf' });

module.exports = mongoose.model('Planning', planningSchema);