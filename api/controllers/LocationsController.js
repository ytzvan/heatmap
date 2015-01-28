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
		var url = sails.config.access.ACCESS_URL;
		var token = sails.config.access.ACCESS_TOKEN;
		var options = {
		    url: url,
		    headers: {
		    	'Content-Type': 'application/json',	
		        'Authorization': 'Bearer ' +token
		    }
		};

		var q = async.queue(function (task, done) {
				console.log(url);
		    request(task.url, function(err, res, body) {

		        if (err) return done(console.log('err'));
		        if (res.statusCode != 200) return done(console.log('distinto de 200: '+res.statusCode));

		        var info = JSON.parse(body);
		        console.log(info);
		        done();
		    }),5});


		q.push({url: options}, function (err) {
			res.send('finished processing bar');
		});

	}	
};

