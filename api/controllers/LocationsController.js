/**
 * LocationsController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


module.exports = {

	fetchData : function(req, res) {
		var request = require('request');
		var token = "PUT TOKEN HERE";
		var options = {
		    url: 'PUT URL HERE',
		    headers: {
		    		'Content-Type': 'application/json',	
		        'Authorization': 'Bearer ' +token
		    }
		};

		function callback(error, response, body) {

		    if (!error && response.statusCode == 200) {
		        var info = JSON.parse(body);
		        console.log(info);
		        console.log(response.statusCode);
		    } else {
		    	console.log(response.statusCode);
		    }
		}

		request(options, callback);
	}
};

