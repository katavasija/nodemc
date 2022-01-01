/*
 * Helpers for various tasks
 *
 */
 
 // Dependencies
 const crypto = require('crypto');
 const config = require('./config');
  
 // container
 const helpers = {};
 
 // SHA256 hash
 helpers.hash = function(str) {
	if (typeof(str) == 'string' && str.length > 0) {
		const hashedStr = crypto.createHmac('sha256', config.hashingSecret)
								.update(str).digest('hex');
		return hashedStr;
	} else {
		return false;
	}
 }
 
 // Parse a JSON string to an object , without throwing
 helpers.parseJsonToObject = function(str) {
	 try {
		 const obj = JSON.parse(str);
		 return obj;
	 } catch (e) {
		 return {};
	 }
 }
 
 // export module
 module.exports = helpers;
 