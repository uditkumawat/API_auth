'use strict';

let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let moment = require('moment-timezone');

let constants = require('../Config/constants.js');

let Schema = mongoose.Schema;

let UserSchema = new Schema({

	username:{type:String,required:true,unique:true},
	name:{type:String,required:true},
	email:{type:String,required:true,unique:true},
	password:{type:String,required:true},
	created_at:{type:Date,default:new Date()},
	modified_at:{type:Date},
	profile_image:{type:String},
	description:{type:String,default:null},
	favourites_count:{type:Number,default:0},
	follow_request_sent:{type:Boolean},
	sex:{type:String,enum:['M','F']},
	followers_count:{type:Number,default:0},
	geo_enabled:{type:Boolean,default:false},
	id:{type:Number},
	location: {
        	'type': {type: String, enum: constants.GEO_JSON_TYPES.Point, default: constants.GEO_JSON_TYPES.Point},
        	 coordinates: {type: [Number], default: [0, 0]}
    	},
	status_count:{type:Number,default:0},
	isDeleted:{type:Boolean,default:false},
	isActive:{type:Boolean,default:true},
	isVerified:{type:Boolean,default:false},
	timezone:{type:String,default:moment().tz('Asia/Kolkata').format()},	
	token:{type:String,default:null}
});

UserSchema.pre('save',function(next){

	let user = this;
	let SALT_WORK_FACTOR = 10;
	
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		
		if(err){
			return next(err);
		}
		
		bcrypt.hash(user.password,salt,function(err,hash){
			
			if(err)
			{
				return next(err);
			}

			user.password = hash;
			next();
		});
	});

});

//schemaname.methods.fucntion_name predefined method to add methods to models 
UserSchema.methods.comparePassword = function(candidatePassword,cb){
	
	bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
		if(err)
			return cb(err);

		cb(null,isMatch);
	}
	
)};



module.exports = mongoose.model('User',UserSchema,'users');
