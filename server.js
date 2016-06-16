'use strict';

const Hapi = require('hapi');
const Hapiswagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');
const Joi = require('joi');
const Good = require('good');
const mongoose = require('mongoose');
const Path = require('path');
const Pack = require('./package');
const log4js = require('log4js');
const Boom = require('boom');
const glob = require('glob');

let logger = log4js.getLogger('[SERVER]');

const Config = require('./Config');
const Routes = require('./Routes');
const Plugins = require('./Plugins');

/********** Server config **************/

const server = new Hapi.Server();

let connectionOptions = {
	port : Config.serverConfig.PORT,
	host : Config.serverConfig.HOST,
	routes : {
		cors:true
	}
};
server.connection(connectionOptions);

/********** Swagger documentation ******/
const options = {
	info :{
		'title':'Twitter API',
		'version':Pack.version,
	}
};



/***** before registering Routes ..we have to register our plugins ****************/

/********** Registering plugins *******/

server.register(Plugins,function(err){
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log("Plugins loaded");
	}
});




/********** Registering API ************/

Routes.forEach(function(api){
	server.route(api);
})


/********** Starting server **********/
server.start((err)=>{
	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log('Server running at :'+server.info.uri);
	}
});
