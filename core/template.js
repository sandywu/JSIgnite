var url = require('url'),
	path = require('path'),
	fs = require('fs');

/**
 * Returns the template file from the file name
 *
 * @param string template
 * @return string
 * @type string
 */	
function _get_template_file(template, data, response)
{
	var tmp_file = path.join(process.cwd(), 'app/templates/' + template + '.tpl');
	
	console.log(tmp_file);
	
	path.exists(tmp_file, function(exists){
	
		if(! exists)
		{
			console.log("%s does not exist!", tmp_file);
		}
		
		fs.readFile(tmp_file, function(err, file) {
			if(! err)
			{
				return _do_parse(file, data, response);
			}
			
			console.log(err);
		});
	});
}

/**
 * Parses pseudovariables, replaces content, and displays the template
 *
 * @param string tmp
 * @object data
 */
function _do_parse(tmp, data, response)
{
	var pairs = [],
		pseudos = [], 
		num_pairs = 0,
		num_pseudos = 0,
		i = 0,
		j = 0,
		var_name = '',
		rep_data = {},
		tmp_data = '',
		data_len;
		
	tmp = String(tmp);

	//Remove newlines and tabs from template because
	//those whitespace characters are extra bandwidth
	tmp = tmp.replace(/\s+/gim, " ");
	tmp = tmp.replace(/>\s+</gim, "><");
	tmp = tmp.replace(/>\s+\{/gim, ">{");
	tmp = tmp.replace(/\}\s+</gim, "}<");
	
	//Match all the looped sections of content
	pairs = tmp.match(/\{([A-Z0-9_\-]+)\}(.*)\{\/\1\}/gim);
	
	if(pairs != null)
	{
		num_pairs = pairs.length;
		
		//Go through the template, and match the pairs
		for(i=0;i<num_pairs;i++)
		{
			//Put the loop in a placeholder
			tmp = tmp.replace(pairs[i], "{"+i+"}");
			
			//Create a place to store looped data
			tmp_data = "";
			
			//The replace variable is the name of the tag
			var var_name = String(pairs[i]).match(/^\{([A-Z0-9_\-]+)\}/i);
			rep_data = data[var_name[1]];
			
			//Make sure there are loops
			if(rep_data.length > 0)
			{
				data_len = rep_data.length;
				
				//Get rid of the loop tags
				pairs[i] = pairs[i].replace(/\{([A-Z0-9_\-]+)\}(.*)\{\/\1\}/gim, "$2");
				
				//Replace psudovariables with data
				for(j=0;j<data_len;j++)
				{
					//Is there a better way to do this, rather than an inline function?
					tmp_data += pairs[i].replace(/\{([A-Z0-9 _\-]+)\}/gi, function(_, varName){
						return (rep_data[j][varName]) ? rep_data[j][varName] : ""; 
					});
				}
			}
			
			//Replace the looped content
			tmp = tmp.replace("{"+i+"}", tmp_data);
		}
	}
	
	//Replace all the rest of the psudeovariables
	pseudos = tmp.match(/\{([A-Z0-9_\-]+)\}/gim);
	
	if(pseudos != null)
	{
		num_pseudos = pseudos.length;
	
		for(i=0;i<num_pseudos;i++)
		{
			//Remove the {} from the pseudos
			var_name = pseudos[i].replace('{', '');
			var_name = var_name.replace('}', '');
			
			//Replace each pseudovariable with the value of the object
			//property of the same name
			tmp = tmp.replace(pseudos[i], data[var_name]);
		}
	}
	
	//Finally, return the value
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(tmp);
	response.end();
}

var template = {
	/**
	 * Parse
	 *
	 * Renders the template by replacing the pseudovariables
	 * with the appropriate data
	 * @param string template
	 * @param object data
	 */
	parse: function(tmp, data, response)
	{
		return _get_template_file(tmp, data, response);
	}
};

exports.parse = template.parse;