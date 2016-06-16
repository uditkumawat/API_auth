'use strict';
const User = require('../Models/user.js');
const config = require('../Config');


function validate(decodedToken,request,callback){

	console.log(decodedToken);

	User.findOne({username:decodedToken.id},function(err,user){
		
			if(err)
				throw err;
				

		let error,credentials = user.username || {};
	
		console.log(credentials);
		if(!credentials)
			callback(null,false,credentials);
		callback(null,true,credentials);
	});
	

};

exports.register = function(server, options, next){


    server.register(require('hapi-auth-jwt2'),(err)=>{
			
	server.auth.strategy('token','jwt',{
	    
			key : config.jwtSecret.key,
			validateFunc : validate,
			verifyOptions:{ algorithms:['HS256'] }
	});
	
    });
    
    next();
};

exports.register.attributes = {
    name: 'hapi-auth-plugin2'
};
