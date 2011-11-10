var http = require("http"),
	url = require("url"),
	path = require("path");

function start(route, handle) {
  function onRequest(request, response) {
  	
  	//Parse the pathname of the url
  	var pathname = url.parse(request.url).pathname;
  	
  	//Log the request
    console.log("Request for " + pathname + " received.");
    
    //Send the request to the router to determine where to go from here
	route(handle, pathname, response);
  }

  http.createServer(onRequest).listen(8124);
  console.log("Server has started.");
}

exports.start = start;