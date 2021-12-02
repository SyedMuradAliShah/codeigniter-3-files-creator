var capitalize = require('./functions');

module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "Enter name of folder",
        placeHolder: "Enter name to create or choose folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vscode.window.showInformationMessage("Models main folder selected.");
        }
        vscode.window.showInputBox({
            prompt: "Enter name of model",
            placeHolder: "Enter model name without _model"
        }).then(function (val) {
            if (val.length == 0) {
                vscode.window.showErrorMessage("Model file name required.");
            } else {
                var modelDir = pathdir + "/application/models/" + folderName;
                var pathfile = path.join(modelDir, capitalize.capitalize(val)) + "_model.php";
                fs.access(pathfile, function (err) {
                    if (!err) {
                        vscode.window.showWarningMessage("Model file name already exists  !");
                    } else {
                        if (!fs.existsSync(modelDir)) {
                            fs.mkdirSync(modelDir);
                            vscode.window.showInformationMessage(folderName + " folder created in models.");
                        }
                        fs.open(pathfile, "w+", function (err, fd) {
                            if (err) throw err;
                            fs.writeFileSync(fd, `<?php 

defined('BASEPATH') OR exit('No direct script access allowed');
                        
class ${capitalize.capitalize(val)}_model extends CI_Model 
{
    public function select()
    {

    }                        
                        
}


/* End of file ${capitalize.capitalize(val)}_model.php and path ${pathfile.replace(pathdir,'')} */
`);
                            fs.close(fd);
                            var openPath = vscode.Uri.file(pathfile); //A request file path
                            vscode.workspace.openTextDocument(openPath).then(function (val) {
                                vscode.window.showTextDocument(val);
                            });
                        });
                        vscode.window.showInformationMessage('Model created successfully!');
                    }
                });
            }
        });
    });
}