/**
 * Router
 * 
 * Maps urls to filepaths / controllers
 * @file router.js
 */
var path = require('path'),
	fs = require('fs');

function route(handle, pathinfo, response){
	console.log("About to route a request for " + pathinfo);
	if(typeof handle[pathinfo] === 'function')
	{
		handle[pathinfo](response);
	}
	else
	{
		var uri = path.join(process.cwd(), pathinfo);
	
		path.exists(uri, function(exists) {  
	        if(!exists) {  
	        	console.log("No request handler found for " + pathinfo);
		    	response.writeHead(404, {"Content-Type": "text/html"});
		    	response.write("<h1>404 Not found</h1>");
		    	response.end(); 
		    	
		    	return; 
	        }
	        
	        //Is it a directory? Say you can't list files
	        if(fs.statSync(uri).isDirectory())
	        {
	        	response.writeHead(503, {"Content-Type": "text/html"});
		    	response.write("<h1>Directory Listing not allowed</h1>");
		    	response.end();
		    	
		    	return;
	        } 
	        
	        console.log(uri); 
	  
	        fs.readFile(uri, "binary", function(err, file) {  
	            if(err) {  
	                response.setHeader(500, {"Content-Type": "text/html"});  
	                response.write(err + "\n");  
	                response.end();  
	                return;  
	            }  
	  
	            response.statusCode = 200;  
	            response.write(file, "binary");  
	            response.end();  
	        });  
	    });
	}
}

exports.route = route;