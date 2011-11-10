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

//Why can't you just pass an object to export?
for(i in controller)
{
	exports[i] = controller[i];
}