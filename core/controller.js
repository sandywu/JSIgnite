/**
 * Controller Module
 * 
 * Need to figure out a way to make this more pratical
 * as in separated controllers in the app's controller 
 * folder
 */
var i,
	controller,
	template = require('./template');
	

controller = {
	index: function(response)
	{
		//Pass the template to the parser
		template.parse('index', {}, response);
	}
};

module.exports = controller;