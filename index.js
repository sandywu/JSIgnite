/**
 * Include the core files
 * 
 * @file index.js
 */
var server = require("./core/server");
var router = require("./core/router");
var controller = require("./core/controller");

console.time('start');

var path = {},
	item;

for(item in controller)
{
	path['/'+item] = controller[item];
}

path["/"] = controller.index;

server.start(router.route, path);