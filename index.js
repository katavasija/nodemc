/*
 * Primary file for the API
 *
 */
 
 // dependencies
 const http = require('http');
 const url = require('url');
 const StringDecoder = require('string_decoder').StringDecoder;
 
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
	const method = req.method.toUpperCase();
	
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
		// send the response
		res.end('Server is here)');
	
		// log
		let mes = 'Request recieved on path:' + trimmedPath + '; method ' + method;
		mes += '; params:';
		console.log(mes, queryParamsObject);
		if (buffer) {
			console.log('payload:', buffer);
		}
	});
 });
  
 // Start the server and have it listen on port 3000
 server.listen(3000, function() {
	console.log('The server is listening on port 3000 now.'); 
 });