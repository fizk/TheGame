var express = require('express');
var router = express.Router();
var rabbitHub = require('rabbitmq-nodejs-client');
var ObjectID = require('mongodb').ObjectID;
var validator = require('node-validator');

/**
 * Create, config and connect to RabbitMQ server
 */
var theHub = undefined;
var pubHub = rabbitHub.create( { task: 'pub', channel: 'myChannel' } );
pubHub.on('connection', function(hub) {
	theHub = hub;
});
pubHub.connect();


/**
 * Home page
 */
router.get('/', function(request, response) {
	response.render('./index',{});

});

/**
 * Home page - Þrautir
 */
router.get('/thrautir', function(request, response) {
	response.render('./puzzles',{});

});

/**
 * Home page - Stimpilleikur
 */
router.get('/stimpilleikur', function(request, response) {
	response.render('./passport',{});

});

/**
 * Upload video form
 */
router.get('/senda-inn-myndband',function(request, response){
    response.render('./upload-video',{});
});

/**
 * Terms and conditions
 */
router.get('/skilmalar',function(request, response){
    response.render('./terms',{});
});


/**
 * View one video
 */
router.get('/myndband/:id',function(request, response){
	var collection = request.db.collection('videos');
	collection.findOne({_id:new ObjectID.createFromHexString(request.param('id'))},function(error,data){
		response.render('./video',{
			host: request.headers.host,
			video: data
		});
	});
});

/**
 * View all videos
 */
router.get('/myndband',function(request, response){
	var collection = request.db.collection('videos');
	collection.find({videos: {$exists:true}}).sort({date:-1}).toArray(function(error, data){
		response.render('./video-list',{
			host: request.headers.host,
			videos: data
		});
	});
});

/**
 *
 */
var credentialFormCheck = validator.isObject()
	//.withRequired('video_name', validator.isString({ regex: /\.*/ })) 		//TODO
	.withRequired('name', validator.isString({ regex: /\.*/ })) 			//TODO
	//.withRequired('phone', validator.isString({ regex: /^[0-9]{3}-[0-9]{4}$/ }))
    .withRequired('phone', validator.isString({ regex: /^[0-9]{7}$/ }))
	.withRequired('email', validator.isString({ regex: /\S+@\S+\.\S+/ }))
	.withRequired('category')
	.withRequired('accept', validator.isString({ regex: /^(true)/i }));
router.post('/video/submit',validator.express(credentialFormCheck),function(request, response){
	var collection = request.db.collection('videos');
	request.body.host = request.headers.host;
	request.body.date = new Date();
	request.body.category = ( Array.isArray(request.body.category) )
		? request.body.category
		: [request.body.category];
	collection.save(request.body,function(error,data){
		response.json( data );
	});

});


router.post('/video/simple-submit',validator.express(credentialFormCheck),function(request, response){
	var collection = request.db.collection('videos');
	request.body.host = request.headers.host;
	request.body.date = new Date();
	request.body.file = request.files.file;
	request.body.category = ( Array.isArray(request.body.category) )
		? request.body.category
		: [request.body.category];
	collection.save(request.body,function(error,data){
		theHub.send( JSON.stringify(data) );
		response.render('./upload-success',{});
	});


});

/**
 * Save file to storage
 */
router.post('/video/submit/:id',function(request, response){
	var collection = request.db.collection('videos');

	collection.findOne({_id:new ObjectID.createFromHexString(request.param('id'))},function(error,document){
		if(error){
			response.status(500);
			response.json(error);
		}else{
			document.file = request.files.file;
			collection.save(document,function(error,doc){
				theHub.send( JSON.stringify(document) );
				response.json(document);
			});
		}


	});

});

router.get('/video/status/:id',function(request, response){
	var collection = request.db.collection('videos');
	collection.findOne({_id:new ObjectID.createFromHexString(request.param('id'))},function(error,data){
		response.json(data);
	});
});

router.get('/video/redo/:id',function(request, response){
	if( request.isAuthenticated() && request.user.admin ){
		var collection = request.db.collection('videos');
		collection.update({_id:new ObjectID.createFromHexString(request.param('id'))},{$unset:{posters:'',videos:''}},function(error,document){
			collection.findOne({_id:new ObjectID.createFromHexString(request.param('id'))},function(error,doc){
				if(doc){
					theHub.send( JSON.stringify(doc) );
					response.json(doc);
				}else{
					response.json({message:'entry not found'});
				}
			});
		});
	}else{
		response.status(403).render('./error',{message:'Access denied'});
	}

});

router.get('/video/delete/:id',function(request, response){
	if( request.isAuthenticated() && request.user.admin ){
		var collection = request.db.collection('videos');
		collection.remove({_id:new ObjectID.createFromHexString(request.param('id'))},function(error,document){
			response.redirect('/myndband');
			response.json(arguments);
		});
	}else{
		response.status(403).render('./error',{message:'Access denied'});
	}

});

router.get('/video/problem',function(request, response){
	if( request.isAuthenticated() && request.user.admin ) {
		var collection = request.db.collection('videos');
		collection.find({videos: {$exists: false}}).sort({date: -1}).toArray(function (error, documents) {
			response.render('./video-list-problem', {
				videos: documents
			});
		});
	}else{
		response.status(403).render('./error',{message:'Access denied'});
	}
});

module.exports = router;
