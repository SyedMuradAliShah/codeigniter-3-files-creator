var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    vscode.window.showInputBox({
        prompt: "Enter name of folder",
        placeHolder: "Enter name of create or choose folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vscode.window.showInformationMessage("Controllers main folder selected.");
        }
        vscode.window.showInputBox({
            prompt: "Enter name of controller",
            placeHolder: "Enter controller name"
        }).then(function (val) {
            if (val.length == 0) {
                vscode.window.showErrorMessage("Controller file name required.");
            } else {

                var controllerDir = pathdir + "/application/controllers/" + folderName;
                var pathfile = path.join(controllerDir, capitalize.capitalize(val)) + ".php";
                fs.access(pathfile, function (err) {
                    if (!err) {
                        vscode.window.showWarningMessage("Name of file already exists  !");
                    } else {
                        if (!fs.existsSync(controllerDir)) {
                            try {
                                fs.mkdirSync(controllerDir, {
                                    recursive: true
                                });
                            } catch (err) {
                                console.log(err);
                            }
                            vscode.window.showInformationMessage(folderName + " folder created in controllers.");
                        }
                        fs.open(pathfile, "w+", function (err, fd) {
                            if (err) throw err;
                            fs.writeFileSync(fd, `<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class ${capitalize.capitalize(val)} extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
    }

    public function index()
    {

    }
}

/* End of file ${capitalize.capitalize(val)}.php and path ${pathfile.replace(pathdir,'')} */
`);
                            fs.close(fd);
                            var openPath = vscode.Uri.file(pathfile); //A request file path
                            vscode.workspace.openTextDocument(openPath).then(function (val) {
                                vscode.window.showTextDocument(val);
                            });
                        });
                        vscode.window.showInformationMessage('Contoller created successfully! ');
                    }
                });
            }
        });
    });
}