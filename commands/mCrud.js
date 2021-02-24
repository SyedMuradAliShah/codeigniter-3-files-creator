var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    vscode.window.showInputBox({
        prompt: "name of controller/model",
        placeHolder: "Enter controller & model name"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Controller and model file name required.");
            return;
        }
        var controller = path.join(pathdir + "/application/controllers", capitalize.capitalize(val)) + ".php";
        var model = path.join(pathdir + "/application/models", capitalize.capitalize(val)) + "_model.php";

        fs.access(controller, function (err) {
            if (!err) {
                vscode.window.showWarningMessage("Controller already exists!");
                return;
            } else {
                fs.access(model, function (err) {
                    if (!err) {
                        vscode.window.showWarningMessage("Model already exists!");
                        return;
                    }
                });
            }
        });


        fs.open(model, "w+", function (err, fd) {
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
            var openPath = vscode.Uri.file(model); //A request file path

            vscode.workspace.openTextDocument(openPath).then(function (val) {
                vscode.window.showTextDocument(val);
            });
        });

        fs.open(controller, "w+", function (err, fd) {
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
            var openPath = vscode.Uri.file(controller); //A request file path

            vscode.workspace.openTextDocument(openPath).then(function (val) {
                vscode.window.showTextDocument(val);
            });

        });
        vscode.window.showInformationMessage('Controller & Model successfully! ');

    });
}