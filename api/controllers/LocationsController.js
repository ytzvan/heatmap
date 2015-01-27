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
	}
};

