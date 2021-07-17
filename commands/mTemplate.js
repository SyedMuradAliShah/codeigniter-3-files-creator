var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    var library_path = "/application/libraries/";
    var view_path = "/application/views/";

    vscode.window.showInputBox({
        prompt: "name of library/template",
        placeHolder: "Enter library & view file name"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Library & view file name required.");
            return;
        }
        var libraryDir = pathdir + library_path;
        var viewDir = pathdir + view_path;

        var libraryPath = path.join(libraryDir, capitalize.capitalize(val)) + ".php";
        var viewPath = path.join(viewDir, capitalize.capitalize(val)) + ".php";

        fs.access(libraryPath, function (libraryExists) {
            if (!libraryExists) {
                vscode.window.showWarningMessage("Library file name already exists!");
            } else {
                fs.access(viewPath, function (viewExists) {
                    if (!viewExists) {
                        vscode.window.showWarningMessage("View file name already exists!");
                    } else {
                        if (!fs.existsSync(viewDir)) {
                            fs.mkdirSync(viewDir);
                            vscode.window.showInformationMessage(folderName + " folder created in views.");
                        }
                        if (!fs.existsSync(libraryDir)) {
                            fs.mkdirSync(libraryDir);
                            vscode.window.showInformationMessage(folderName + " folder created in libraries.");
                        }
                        fs.open(viewPath, "w+", function (err, fd) {
                            if (err) throw err;
                            fs.writeFileSync(fd, `<?php

/**
* Uncomment below line and load your header to inculde header.
*/

//$this->load->view('layout/header');

/**
* This content will include loading view and its data.
*/
echo $template_contents;


/**
* Uncomment below line and load your footer to inculde footer.
*/
//$this->load->view('layout/footer');

/* End of file ` + capitalize.capitalize(val) + `.php and path ` + view_path + val + `.php */

?>`);
                            fs.close(fd);

                            fs.open(libraryPath, "w+", function (err, fd) {
                                if (err) throw err;
                                fs.writeFileSync(fd, `<?php defined('BASEPATH') OR exit('No direct script access allowed');

class ` + capitalize.capitalize(val) + ` {
        private $template_data = [];
        
        /**
         * This function will use to set template data.
         * 
         * @param mix $name this will be the name of the variable which will show in view ` + capitalize.lowercase(val) + `.
         * @param mix $value this will be the return value from the view, passed to variable $view.
         * @return void 
         */
        function _set($name, $value)
        {
            $this->template_data[$name] = $value;
        }

        /**
         * This function will use to load template.
         * 
         * @param mix $view this will be the view file name.
         * @param array $view_data this will be the data you want to pass to the view.
         * @param mix $template your default template name is ` + capitalize.lowercase(val) + `, if changed, use your template file own name.
         * @param bool $return type of your view.
         * @return void 
         */
    
        function load($view = '' , $view_data = [], $template = '` + capitalize.lowercase(val) + `', $return = FALSE)
        {               
            $this->CI =& get_instance();
            $this->_set('template_contents', $this->CI->load->view($view, $view_data, TRUE));            
            return $this->CI->load->view($template, $this->template_data, $return);
        }
}

/* End of file ` + capitalize.capitalize(val) + `.php and path ` + library_path + val + `.php */

`);
                                fs.close(fd);

                                var libraryOpenPath = vscode.Uri.file(libraryPath); //A request file path
                                vscode.workspace.openTextDocument(libraryOpenPath).then(function (val) {
                                    vscode.window.showTextDocument(val);
                                });
                            });
                        });
                    }
                });
            }
        });
        vscode.window.showInformationMessage('Template library and view created successfully!');
    });
}