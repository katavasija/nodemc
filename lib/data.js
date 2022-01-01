/*
 * Library for storing and editing data
 *
 */
 
 // dependencies
 const fs = require('fs');
 const path = require('path');
 const helper = require('./helpers');
 
 // container for the module
 lib = {}
 
 // base directory of data folder
 lib.baseDir = path.join(__dirname, '/../.data/');
 
 // CREATE 
 //
 lib.create = function(dir, file, data, callback) {
	// open the new file for writing
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', 
			function(err, fileDescriptor) {
				if (!err && fileDescriptor) {
					// convert data to string
					const stringData = JSON.stringify(data);
					fs.writeFile(fileDescriptor, stringData, function(err){
						if (!err) {
							fs.close(fileDescriptor, function(err) {
								if (!err) {
									// no error
									callback(false);
								} else {
									callback('Error closing new file...');
								}
							});
						} else {
							callback('Error writing to new file...');
						}
					});
				} else {
					callback('Could not create new file...');
				}
			}
	);
 }
 
 // READ
 //
 lib.read = function(dir, file, callback) {
	fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function(err, data) {
		if (!err && data) {
			const parsedData = helper.parseJsonToObject(data);
			callback(false, parsedData);
		} else {
			callback(err, data);
		}
	});
 }
 
 // UPDATE
 //
 lib.update = function(dir, file, data, callback) {
	 // open existing file for update
	 fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+',
			function(err, fileDescriptor) {
				if (!err && fileDescriptor) {
					// convert data to string
					const stringData = JSON.stringify(data);
					// truncate the file
					fs.ftruncate(fileDescriptor, function(err) {
							if (!err) {
								// write to the file
								fs.writeFile(fileDescriptor, stringData, function(err) {
									if (!err) {
										// close the file
										fs.close(fileDescriptor, function(err) {
												if (!err) {
													// no error
													callback(false);
												} else {
													callback('Error closing file.');
												}
											}
										);
									} else {
										callback('Error writing to the existing file.');
									}
								});
							} else {
								callback('Error truncating file.');
							}
						}
					);
				} else {
					callback('Could not open file for update.');
				}
			}
	 );
 }
 
 // DELETE
 lib.delete = function(dir, file, callback) {
	fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err) {
		if (!err) {
			callback(false);
		} else {
			callback('Error deleting file.');
		}
	});
 }
  
 // Export the module
 module.exports = lib;
 