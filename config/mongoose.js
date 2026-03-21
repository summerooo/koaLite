const mongoose = require('mongoose');
const env = require('./env');

mongoose.connect(env.MONGODB_URI);

module.exports = mongoose;
