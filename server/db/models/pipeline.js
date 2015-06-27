'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	pipeline: [{
		gitUrl: { type: String, required: true },
		order: { type: Number, required: true }
	}],
	runs: [{ type: Date, required: true }]
});

mongoose.model('Pipeline', schema)