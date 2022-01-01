/*
 * Library for request handling
 *
 */
 
 // Dependencies
 const helper = require('./helpers');
 const _data = require('./data');
 
 const handlers = {};

 // Users
 handlers.users = function(data, callback) {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > - 1) {
		handlers._users[data.method](data, callback);
	} else {
		// method not allowed
		callback(405);
	}
 }
 
 // Users submethods container
 //
 handlers._users = {};
 
 /* users post
	* Required: login, password, tosAgreement
	* Optional: none
 */
 handlers._users.post = function(data, callback) {
	// check required
	//
	let rawPiece = data.payload.login;
	const login = typeof(rawPiece) == 'string' && rawPiece.trim().length > 0 ?
					  rawPiece :
					  false;
	
	rawPiece = data.payload.password;
	const password = typeof(rawPiece) == 'string' && rawPiece.trim().length > 0 ?
					  rawPiece :
					  false;
	
	rawPiece = data.payload.tosAgreement;
	const tosAgreement = typeof(rawPiece) == 'boolean' ?
					  rawPiece :
					  false;
	if (login && password && tosAgreement) {
		// make sure that user doesn't exist
		_data.read('users', login, function(err, data) {
			let errTxt = '';
			// login allowed
			if (err) {
				// hash the password
				const hashedPassword = helper.hash(password);
				console.log(hashedPassword);
				if (hashedPassword) {
					const userObject = {
						'hashedPassword': hashedPassword,
						'tosAgreement': tosAgreement,
					};
					_data.create('users', login, userObject, function(err) {
						if (err) {
							errTxt = 'Could not create new user.';
							callback(500, {'error': errTxt});
						} else {
							callback(200);
						}
					});
				} else {
					errTxt = 'Could not hash the user\'s password.';
					callback(500, {'error': errTxt});
				}
			} else {
				callback(400, {'error': 'User login is not unique.'})
			}
		});
	} else {
		callback(400, {'error': 'Missing required fields.'})
	}
 }
 
 /* users get
  * Required: login
  * Optional: none
  * @TODO: only authenticated user access their object
  * don't let them access anyone else
 */
 handlers._users.get = function(data, callback) {
	const rawPiece = data.queryParams.login; 
	const login = typeof(rawPiece) == 'string' ? rawPiece : false;
	if (login) {
		_data.read('users', login, function(err, data) {
			if (!err && data) {
				// remove the hashed password from the data
				data.hashedPassword = 'x';
				callback(200, data);
			} else {
				callback(404);
			}
		});
	} else {
		callback(400, {'error': 'Missing required field.'});
	}
 }

// users put
 handlers._users.put = function(data, callback) {
	
 }
 
 // users delete
 handlers._users.delete = function(data, callback) {
	
 }
 
 // ping handler
 handlers.ping = function(data, callback) {
	callback(200);
 };
 
 // not found handler
 handlers.notFound = function(data, callback) {
	callback(404);
 };
 
 // export module
 module.exports = handlers;
 