/*
 * Primary file for the API
 *
 */
 
 // dependencies
 const http = require('http');
 const url = require('url');
 
 // The server should respond to all requests with a string.
 const server = http.createServer( function(req, res) {
	// get the url and parse it
	const parsedUrl = url.parse(req.url, true);
	
	// get the pathname
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/|\/+$/g, '');
	
	// send the response
	res.end('Server is here)');
	
	// log
	console.log('Request recieved on path:' + trimmedPath);
 });
  
 // Start the server and have it listen on port 3000
 server.listen(3000, function() {
	console.log('The server is listening on port 3000 now.'); 
 });