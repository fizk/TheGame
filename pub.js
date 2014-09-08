/**
 * Created by einarvalur on 26/05/14.
 */

var rabbitHub = require('rabbitmq-nodejs-client');

var pubHub = rabbitHub.create( { task: 'pub', channel: 'myChannel' } );
pubHub.on('connection', function(hub) {
	console.log(hub);
	hub.send('Hello World!');

});
pubHub.connect();