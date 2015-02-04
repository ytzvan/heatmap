/**
 * LocationsController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

	fetchData : function(req, res) {
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

		function callback(error, response, body) {

		    if (!error && response.statusCode == 200) {
		        var info = JSON.parse(body);
		        console.log(info);
		        res.json(info);
		    } else {
		    	console.log(response.statusCode);
		    }
		}

		request(options, callback);
	},

	multiple : function (req, res) {

		var request = require('request');
		var token = sails.config.access.ACCESS_TOKEN;

		var q = async.queue(function (task, done) {
		    request(task.url, function(err, res, body) {

		        if (err) return done(console.log('err'));
		        if (res.statusCode != 200) return done(console.log('distinto de 200: '+res.statusCode));

		        var info = JSON.parse(body);

		        var rows = info.meta.pagination.pages;

		        for(var i in info.visits){
              var id = info.visits[i].id;
              var latitude = info.visits[i].latitude;
              var longitude = info.visits[i].longitude;
              
              Locations.findOrCreate({visitId:id},
              	{visitId: id,
                latitude : latitude,
                longitude : longitude})
              .exec(function createFindCB(err,created){
               //console.log('Creacion # '+created.visitId+' '+created.latitude+' '+created.longitude);
                });
        		}
						return done();
		    }),1});


			for (var page = 1; page<10; page++) {

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


			q.push({url: options}, function (err) {
				res.send("end");
			});

			}
	}
};

