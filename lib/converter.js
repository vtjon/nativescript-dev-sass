exports.convert = convert;

var fs = require("fs");
var path = require("path");
var sass = require("node-sass");
var glob = require("glob");
var importer = require("./importer");

function convert(logger, projectDir, options) {
  return new Promise(function(resolve, reject) {
    options = options || {};

    var sassFilesPath = path.join(projectDir, "app/**/[!_]*.scss");
    var sassFiles = glob.sync(sassFilesPath).filter(function(fileName) {
      return fileName.indexOf("App_Resources") === -1;
    });

    var i = 0;
    var loopSASSFilesAsync = function(sassFiles) {
      parseSASS(sassFiles[i], function(e) {
        if (e !== undefined) {
          //Error in the SASS parser; Reject promise
          reject(
            Error(sassFiles[i] + " SASS CSS pre-processing failed. Error: " + e)
          );
        }

        i++; //Increment loop counter

        if (i < sassFiles.length) {
          loopSASSFilesAsync(sassFiles);
        } else {
          //All files have been processed; Resolve promise
          resolve();
        }
      });
    };

    loopSASSFilesAsync(sassFiles);
  });
}

function parseSASS(filePath, callback) {
  var sassFileContent = fs.readFileSync(filePath, { encoding: "utf8" });
  var cssFilePath = filePath.replace(".scss", ".css");

  var result = sass.render(
    {
      file: filePath,
      outputStyle: "compressed",
      outFile: cssFilePath,
      sourceMap: false, // or an absolute or relative (to outFile) path
      importer: importer
    },
    function(error, result) {
      if (error) {
        callback(error);
        return;
      }

      if (!result.css) {
        // No CSS to write to file, so just call callback without creating the file.
        callback();
        return;
      }
      var currentContent = fs.existsSync(cssFilePath)
        ? fs.readFileSync(cssFilePath).toString()
        : null;
      if (currentContent !== result.css.toString()) {
        // Overwrite file only in case the new content is not the same as current one.
        // This prevents infinite loop of `tns run` command.
        fs.writeFileSync(cssFilePath, result.css.toString(), "utf8");
      }
      callback();
    }
  );
}
