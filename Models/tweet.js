'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let tweetSchema = new Schema({
	
	tweet_text:{type:String,required:true,max:140},
	created_at:{type:Date,default:new Date()},
	geo_lat:{type:String,default:0},
	geo_long:{type:String,default:0},
	user_id:{type:String,required:true},
	screen_name:{type:String,default:"twitter"},
	name:{type:String,default:'user'}
});

let Tweet = mongoose.model('Tweet',tweetSchema);


module.exports = Tweet;
