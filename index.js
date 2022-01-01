/*
 * Primary file for the API
 *
 */
 
 // dependencies
 const http = require('http');
 const url = require('url');
 const config = require('./lib/config');
 const StringDecoder = require('string_decoder').StringDecoder;
 const handlers = require('./lib/handlers');
 const helper = require('./lib/helpers');
 
 // The server should respond to all requests with a string.
 const server = http.createServer( function(req, res) {
	// get the url and parse it
	const parsedUrl = url.parse(req.url, true);
	
	// get the pathname
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/|\/+$/g, '');
	
	// query params
	const queryParamsObject = parsedUrl.query;
	
	// get the method
	const method = req.method.toLowerCase();
	
	// get the headers
	const headers = req.headers;
	
	// get the payload if any
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	req.on('data', function(data) {
		buffer += decoder.write(data);
	});
	
	req.on('end', function() {
		buffer += decoder.end();
		
		// choose the handler for request
		const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?
							  router[trimmedPath] :
							  handlers.notFound;
		// construct the data
		const data = {
			'path': trimmedPath,
			'method': method,
			'headers': headers,
			'queryParams': queryParamsObject,
			'payload': helper.parseJsonToObject(buffer),
		};
		
		// log
		let mes = 'Request recieved on path:' + trimmedPath;
		mes +=  '; method ' + method + '; params:';
		console.log(mes, queryParamsObject);
		
		if (headers) {
			console.log('headers:', headers);
		}
		if (buffer) {
			console.log('payload:', buffer);
		}
		
		// route the data to the handler
		chosenHandler(data, function(statusCode, payload) {
			// use statusCode called back by handler, or default 200
			statusCode = typeof(statusCode) == 'number' ? statusCode: 200;
			
			// use payload called back by handler, or default empty {}
			payload = typeof(payload) == 'object' ? payload: {};
			
			const stringPayload = JSON.stringify(payload);
		
			// send the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(stringPayload);
		});
		
	});
 });
  
 // Start the server and have it listen on config.port
 server.listen(config.port, function() {
	let mes = 'The server is listening on port ' + config.port;
	mes += ' in ' + config.envName + ' mode.';
	console.log(mes); 
 });
 
  // Define the router
 const router = {
	ping: handlers.ping,
	users: handlers.users,
 };
 
 
 