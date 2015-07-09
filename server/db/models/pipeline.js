'use strict'
var mongoose = require('mongoose');
var uuid = require('node-uuid'); 

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
		_id: false,
		imageId: {type:String, required:true, default:uuid.v4},
		built: {type: Boolean, default: false}
	}],
	runs: [{
		type: Date,
		required: true
	}]
});


mongoose.model('Pipeline', schema)