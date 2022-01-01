/*
 * Configuration variables for export
 * 
 */
 
 // container for all environments
 const environments = {};

 // staging (default) environment
 environments.staging = {
	'port': 3000,
	'envName': 'staging',
	'hashingSecret': 'thisIsASecret',
 };

 // staging (default) environment
 environments.production = {
	'port': 5000,
	'envName': 'production',
	'hashingSecret': 'thisIsASecret',
 };

 // determine which environment was passed as a command-line argument
 const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ?
						   process.env.NODE_ENV.toLowerCase() :
						   '';

 // Check the current environment, default to staging
 const envToExport = typeof(environments[currentEnvironment]) == 'object' ?
					 environments[currentEnvironment] :
					 environments.staging;

 // Export the module
 module.exports = envToExport;
