'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	github: {
		id: String,
		token: String,
		displayName: String,
		username: String,
		profileUrl: String,
		reposUrl: String,
		image: String,
		location: String
	},
	pipelines: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Pipeline'
	}]
});

mongoose.model('User', schema);