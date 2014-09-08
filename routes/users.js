var ObjectID = require('mongodb').ObjectID;

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(request, response) {
	if( request.isAuthenticated() && request.user.admin ){
		var collection = request.db.collection('users');
		collection.find().toArray(function(error,documents){
			response.render('./users',{
				users:documents
			})
		});
	}else{
		response.status(403).render('./error',{message:'Access denied'});
	}
});

router.get('/admin/:id',function(request,response){
	if( request.isAuthenticated() && request.user.admin ) {
		var collection = request.db.collection('users');
		collection.findOne({_id: new ObjectID.createFromHexString(request.params.id)}, function (error, user) {
			collection.update({_id: new ObjectID.createFromHexString(request.params.id)}, {$set: {admin: !user.admin}}, function (error, count) {
				user.admin = !user.admin;
				response.json(user);
			});

		});
	}else{
		response.status(403).render('./error',{message:'Access denied'});
	}

});

module.exports = router;
