var fs = require('fs');
var path = require('path');
var glob = require('glob');
var Promise = require('bluebird');

module.exports = function ($logger, $projectData, $usbLiveSyncService) {
	// delete all scss files from compiled sources
	var platformsData = $injector.resolve('platformsData');
	return Promise.each(platformsData.platformsNames, function (platform) {
		// Find and remove unnecessary SCSS files from iOS and Android app packages
		var sassFilesPath = path.join(platformsData.getPlatformData(platform).appDestinationDirectoryPath, 'app/**/*.scss');
		var sassFiles = glob.sync(sassFilesPath).filter(function (filePath) {
			var path = filePath;
			var parts = path.split('/');
			var filename = parts[parts.length - 1];
			return path.indexOf("App_Resources") === -1;
		});
		return Promise.each(sassFiles, function (sassFile) {
			return fs.unlinkSync(sassFile);
		});
	});
}