var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Promise = require('bluebird');

// Clean-up files from compiled app packages
module.exports = function (logger, platformsData, projectData, hookArgs) {
	// delete all scss files from compiled sources

	// Don't include .SCSS files in LiveSync -- only sync CSS files
	if (hookArgs.filesToSync !== undefined) {
		hookArgs.filesToSync.forEach(function (file, index) {
			if (file.indexOf(".scss") !== -1) {
				// Remove the .SCSS file from LiveSync operation
				hookArgs.filesToSync.splice(index, 1);
			}
		});
	}

	var platformData = platformsData.getPlatformData(hookArgs.platform.toLowerCase());

	return new Promise(function(resolve, reject) {
		// Remove node_sass directory from compiled output
		var nodeSassPath = path.join(platformData.appDestinationDirectoryPath, 'app/tns_modules/node-sass/');
		deleteFolderRecursive(nodeSassPath);
		
		// Find and remove unnecessary SCSS files from iOS and Android app packages
		var sassFilesPath = path.join(platformData.appDestinationDirectoryPath, 'app/**/*.scss');
		var sassFiles = glob.sync(sassFilesPath).filter(function (filePath) {
			var path = filePath;
			var parts = path.split('/');
			var filename = parts[parts.length - 1];
			return path.indexOf("App_Resources") === -1;
		});

		Promise.each(sassFiles, function (sassFile) {
			return fs.unlinkSync(sassFile);
		})
		.then(function() {
			console.log("All SASS source files removed from app package");
			resolve();
		});
	});
}

// Utility to delete non-empty folder recursively
var deleteFolderRecursive = function(filepath) {
  if( fs.existsSync(filepath)) {
    fs.readdirSync(filepath).forEach(function(file,index){
      var curPath = path.join(filepath, file);
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    return fs.rmdirSync(filepath);
  }
};
