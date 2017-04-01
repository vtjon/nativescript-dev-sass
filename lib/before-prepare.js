var converter = require('./converter');

module.exports = function (logger, platformsData, projectData, hookArgs) {
	// Do not run converter during LiveSync if there are no SCSS files being processed
	var runProcessor = false;
	if (hookArgs.filesToSync !== undefined) {
		hookArgs.filesToSync.forEach(function (file) {
			if (file.indexOf(".scss") !== -1) {
				runProcessor = true;
			}
		});
	} else {
		// Not a LiveSync operation; always run converter
		runProcessor = true;
	}

	if (runProcessor) {
		console.log("Converting SCSS to CSS...");
		return converter.convert(logger, projectData.projectDir);
	}
}
