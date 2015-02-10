/**
 * LocationsController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

	all : function(req, res) {
		Locations.find()
		.sort('createdAt ASC')
		.exec(function findCB(err,data){
               res.send(data);
        });
	},

	multiple : function (req, res) {
		var url = sails.config.access.ACCESS_URL;
		var request = require('request');
		var token = sails.config.access.ACCESS_TOKEN;
		var options = {
		    url: url,
		    headers: {
		    	'Content-Type': 'application/json',	
		        'Authorization': 'Bearer ' +token
		    }
		};
		var pages = 0;

		function callback(error, response, body) {

		    if (!error && response.statusCode == 200) {
		        var info = JSON.parse(body);
		        console.log(info.meta.pagination.pages);
		        pages = parseInt(info.meta.pagination.pages); //Save the # of pages
		        loop(); //Call the loop function and start making request based on the n of pages
		    } else {
		    	console.log(response.statusCode);
		    }
		}

		request(options, callback);


		var q = async.queue(function (task, done) {
		    request(task.url, function(err, res, body) {

		        if (err) return done(console.log('err'));
		        if (res.statusCode != 200) return done(console.log('distinto de 200: '+res.statusCode));

		        var info = JSON.parse(body);

		      for(var i in info.visits){ //Add data to model 
	              
	              Locations.findOrCreate({visitId:info.visits[i].id}, //Create or skip the creation of the data based on the visitID
	              	{visitId: info.visits[i].id,
	                latitude : info.visits[i].latitude,
	                longitude : info.visits[i].longitude})
	              .exec(function createFindCB(err,created){
	               console.log('Creacion # '+created.visitId+' '+created.latitude+' '+created.longitude + ' ' +created.id);
	                });
        		}
				return done();
		    }),5});

			 function loop () {
				for (var page = 1; page<=pages; page++) { //The for loop make the request


					var url = sails.config.access.ACCESS_URL;	
					url = url+"?page="+page;
					console.log(url);

					var options = {
					    url: url,
					    headers: {
					    	'Content-Type': 'application/json',	
					        'Authorization': 'Bearer ' +token
					    }
					};

					q.push({url: options}, function (err) { // The async worker 
						res.send("end");
					});

				}
			 }
	}
};

