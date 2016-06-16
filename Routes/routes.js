'use strict';

const Joi = require('joi');
const async = require('async');
const jwt = require('jsonwebtoken');

const Db = require('../Config/dbConfig');
const CONFIG = require('../Config');
const constants = CONFIG.CONSTANTS;
const User = require('../Models/user.js');
const Plugins = require('../Plugins');

let authorizeHeaderObject = Joi.object({
    authorization: Joi.string().required()
}).unknown();


let get = {
	method:'GET',
	path:'/twitter/api/',
	config:{
		tags:['api'],
		description:'Get all users',
		notes:'Get all users',
		validate:{
			 headers: authorizeHeaderObject,
		},
		auth:{

			strategy:'token'
		}

	},
	handler:function(request,reply){
		
		async.waterfall([
			function(callback){
				
				User.find({},function(err,res){
					
					if(err)
						throw err;
					if(!res)
						callback(null,"No users ");
					
					callback(null,res);
				});
			},
			function(res,callback)
			{
				callback(null,res);
			}
		],

		function(err,res)
		{
			reply(res);
		}
		
		);
	}
};



let login = {
	method : 'POST',
	path : '/twitter/api/login',
	config : {
		tags:['api'],
		description:'Login check',
		notes:'Login Check',
		validate:{
			payload:{
				id : Joi.string().required(),
				password : Joi.string().required()
			}
		}
	},
	handler:function(request,reply)
	{
		async.waterfall([
			function(callback){
				User.findOne({$or:[{email:request.payload.id},{username:request.payload.id}]},function(err,user){
					
					if(err)		
						throw err;
					if(!user)
						callback(null,404);
					else
						callback(null,user);
				});
			},
			function(res,callback){               //here res is the result from upper function 
				if(res===404)
					callback(null,404);
				else
				{
					res.comparePassword(request.payload.password,function(err,isMatch){
						if(err)
							throw err;
						else
							callback(null,isMatch);
					});
				}
			}	
			
		],
		function(err,res)
		{
			if(res===404)
			{
					reply({
						statusCode:404,
						message:'User not Found',
						result:false,
						data:'User not found'
					});
			}
			if(res)
			{
				    let token = jwt.sign({id:request.payload.id},CONFIG.jwtSecret.key,{expiresIn:1440});
							
					reply({
						statusCode:200,
						message:'Login Successful',
						result:true,
						data:'Welcome User',
						token:token
					});
			}
			else
			{
					reply({
                                                 statusCode:200,
                                                 message:'Login UnSuccessful',
                                                 result:false,
                                                 data:'Not valid'
                                         });

			}
		}
		);
	}
};



let register = {
	method:'POST',
	path:'/twitter/api/register',
	config:{
		tags:['api'],
		description:'Register User',
		notes:'Register User',
		validate:{
			payload:{
				name:Joi.string().required(),
				email:Joi.string().required(),
				username:Joi.string().required(),
				password:Joi.string().required(),
				age:Joi.number().required(),
				contact:Joi.number().required()
			}
		}
	},
	handler:function(request,reply){
		
		let user = new User({
			name : request.payload.name,
			email : request.payload.email,
			password : request.payload.password,
			username : request.payload.username,
			age : request.payload.age,
			contact : request.payload.contact	
		});

		user.save(user,(err)=>{
			
			if(err){
				reply({
					statusCode:503,
					message:'User not inserted',
					data:err
				});
			}
			else
			{
				reply({
					statusCode:201,
					message:'User inserted',
				});
			}
		});
	}
};



let logout = {
	method:'GET',
	path:'/twitter/api/logout',
	config:{
		tags:['api'],
		description:'logout',
		notes:"logout"
	},
	handler:function(request,reply){
		
		reply("all clear");
	}
};

let deletes = {
	method:'DELETE',
	path:'/twitter/api/delete',
	config:{
		tags:['api'],
		description:'Delete all users',
		notes:'Delete all users',
		validate:{
			 headers: authorizeHeaderObject,
		},
		auth:{

			strategy:'token'
		}

	},
	handler:function(request,reply){
		
		User.remove({},(err)=>{
			
			if(err){
				
				reply({
					statuscode:503,
					message:'Problem in deleting users'
				});
			}
			else{
				reply({
					statusCode:204,
					message:'All users deleted'
				})
			}
		});
	}
	
};

module.exports = [
	get,
	login,
	register,
	logout,
	deletes
];
