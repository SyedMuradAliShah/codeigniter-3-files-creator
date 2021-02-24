var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    vscode.window.showInputBox({
        prompt: "name of controller/model",
        placeHolder: "Enter controller & model name"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Controller & model file name required.");
            return;
        }
        var controllerPath = path.join(pathdir + "/application/controllers", capitalize.capitalize(val)) + ".php";
        var modelPath = path.join(pathdir + "/application/models", capitalize.capitalize(val)) + "_model.php";

        fs.access(controllerPath, function (controllerExists) {
            if (!controllerExists) {
                vscode.window.showWarningMessage("Controller already exists!");
            } else {
                fs.access(modelPath, function (modelExists) {
                    if (!modelExists) {
                        vscode.window.showWarningMessage("Model already exists!");
                    } else {

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
                        
/* End of file ` + capitalize.capitalize(val) + `_model.php */
                    
                                        `);
                            fs.close(fd);

                            fs.open(controllerPath, "w+", function (err, fd) {
                                if (err) throw err;
                                fs.writeFileSync(fd, `<?php 
        
defined('BASEPATH') OR exit('No direct script access allowed');
        
class ` + capitalize.capitalize(val) + ` extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
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
        
    /* End of file  ` + val + `.php */
        
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
        vscode.window.showInformationMessage('Controller & Model successfully! ');
    });
}