/**
 * Created by einarvalur on 26/05/14.
 */
var rabbitHub = require('rabbitmq-nodejs-client');
var FFmpeg = require('fluent-ffmpeg');
var config = require('./config');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID
var db = undefined;
MongoClient.connect(config.dbUrl, function(err, database) {
	if(err) throw err;
	db = database;
});

var subHub = rabbitHub.create( { task: 'sub', channel: 'myChannel' } );
subHub.on('connection', function(hub) {

	hub.on('message', function(msg) {
		console.log('message in');
		var message = JSON.parse(msg);

		//WEBM
		//	create a WebM file
		new FFmpeg({ source: './public/images/'+message.name })
			.toFormat('webm')
			.on('error',function(error){
				console.log('webm',error);
			})
			.on('end',function(){
				console.log(message);
				db.collection('videos').update({_id:new ObjectID.createFromHexString(message._id)},{$push:{videos:{
					codec: 'video/webm',
					name: message.name+'.webm'
				}}},function(){})
			})
			.saveToFile('./public/images/'+message.name+'.webm');

		//OGG
		//	create a ogg file
		new FFmpeg({ source: './public/images/'+message.name })
			.toFormat('ogg')
			.on('error',function(err, stdout, stderr){
				console.log(err.message); //this will likely return "code=1" not really useful
				console.log("stdout:\n" + stdout);
				console.log("stderr:\n" + stderr);
			})
			.on('end',function(){
				console.log(message);
				db.collection('videos').update({_id:new ObjectID.createFromHexString(message._id)},{$push:{videos:{
					codec: 'video/ogg',
					name: message.name+'.ogg'
				}}},function(){})
			})
			.saveToFile('./public/images/'+message.name+'.ogg');


		//MP4
		//	create a ogg file
		new FFmpeg({ source: './public/images/'+message.name })
			.toFormat('mp4')
			.on('error',function(error){
				console.log('mp4',error);
			})
			.on('end',function(){
				console.log(message);
				db.collection('videos').update({_id:new ObjectID.createFromHexString(message._id)},{$push:{videos:{
					codec: 'video/mp4',
					name: message.name+'.mp4'
				}}},function(){})
			})
			.saveToFile('./public/images/'+message.name+'.mp4');

		//THUMB
		//	create a thumbnail image
		new FFmpeg({ source: './public/images/'+message.name })
			.withSize('320x240')
			.on('error', function(err) {
				console.log('screenshot',err);
			})
			.on('end', function(filenames) {
				console.log(filenames);
				console.log('Successfully generated ' + filenames.join(', '));
				db.collection('videos').update({_id:new ObjectID.createFromHexString(message._id)},{$push:{posters:{$each:filenames}}},function(){})
			})
			.takeScreenshots(5, './public/images');



	}.bind(this));

});
subHub.connect();