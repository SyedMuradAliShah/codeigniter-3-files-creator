var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    vscode.window.showInputBox({
        prompt: "Enter name of folder",
        placeHolder: "Enter name of create or choose folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vscode.window.showInformationMessage("Controllers & models main folder selected.");
        }

        vscode.window.showInputBox({
            prompt: "name of controller/model",
            placeHolder: "Enter controller & model name"
        }).then(function (val) {
            if (val.length == 0) {
                vscode.window.showErrorMessage("Controller & model file name required.");
                return;
            }
            var controllerDir = pathdir + "/application/controllers/" + folderName;
            var modelDir = pathdir + "/application/models/" + folderName;

            var controllerPath = path.join(controllerDir, capitalize.capitalize(val)) + ".php";
            var modelPath = path.join(modelDir, capitalize.capitalize(val)) + "_model.php";

            fs.access(controllerPath, function (controllerExists) {
                if (!controllerExists) {
                    vscode.window.showWarningMessage("Controller file name already exists!");
                } else {
                    fs.access(modelPath, function (modelExists) {
                        if (!modelExists) {
                            vscode.window.showWarningMessage("Model file name already exists!");
                        } else {
                            if (!fs.existsSync(modelDir)) {
                                try {
                                    fs.mkdirSync(modelDir, {
                                        recursive: true
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
                                fs.mkdirSync(modelDir);
                                vscode.window.showInformationMessage(folderName + " folder created in models.");
                            }
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
                            fs.open(modelPath, "w+", function (err, fd) {
                                if (err) throw err;
                                fs.writeFileSync(fd, `<?php 
                
defined('BASEPATH') OR exit('No direct script access allowed');
                        
class ` + capitalize.capitalize(val) + `_model extends CI_Model 
{
    public function __construct()
    {
        parent::__construct();
    }
    
    public function insert()
    {
        
    }

    public function select()
    {
        
    }

    public function update()
    {
        
    }

    public function delete()
    {
        
    }
}

/* End of file ${capitalize.capitalize(val)}_model.php and path ${modelPath.replace(pathdir,'')} */
                    
`);
                                fs.close(fd);
                                fs.open(controllerPath, "w+", function (err, fd) {
                                    if (err) throw err;
                                    if (folderName.length != 0)
                                        var loadModelNamePath = folderName + '/' + capitalize.lowercase(val) + '_model';
                                    else
                                        var loadModelNamePath = capitalize.lowercase(val) + '_model';

                                    fs.writeFileSync(fd, `<?php 
defined('BASEPATH') OR exit('No direct script access allowed');
        
class ` + capitalize.capitalize(val) + ` extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('${loadModelNamePath}', '${val}');
    }

    public function create()
    {
        
    }

    public function view()
    {
        
    }

    public function update()
    {
        
    }

    public function delete()
    {
        
    }
}


/* End of file ${capitalize.capitalize(val)}.php and path ${controllerPath.replace(pathdir,'')} */
`);
                                    fs.close(fd);
                                    var controllerOpenPath = vscode.Uri.file(controllerPath); //A request file path
                                    vscode.workspace.openTextDocument(controllerOpenPath).then(function (val) {
                                        vscode.window.showTextDocument(val);
                                    });
                                });
                            });
                        }
                    });
                }
            });
            vscode.window.showInformationMessage('Controller & Model created successfully!');
        });
    });
}