'use strict'
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	name: String,
	pipeline: [{
		name: String,
		gitUrl: String,
		description: String,
		order: Number,
		_id: false
	}],
	runs: [{
		type: Date,
		required: true
	}]
});

mongoose.model('Pipeline', schema)