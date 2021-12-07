var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {
    const vs_window = vscode.window;

    vs_window.showInputBox({
        prompt: "Enter name of folder for views",
        placeHolder: "Enter name to create or choose folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vs_window.showInformationMessage("Views main folder is selected.");
            var newFolder = '';
        } else {
            var newFolder = `${folderName}/`;
        }

        vs_window.showInputBox({
            prompt: "Enter name of library/template",
            placeHolder: "Enter library & view file name"
        }).then(function (val) {
            if (val.length == 0) {
                vs_window.showErrorMessage("Library & view file name required.");
                return;
            }

            var library_path = "/application/libraries/";
            var view_path = `/application/views/${folderName}`;

            var libraryDir = pathdir + library_path;
            var viewDir = pathdir + view_path;

            var libraryPath = `${path.join(libraryDir, capitalize.capitalize(val))}.php`;
            var viewPath = `${path.join(viewDir, capitalize.lowercase(val))}.php`;
            var viewLayoutHeaderPath = `${path.join(viewDir, 'layout', 'header')}.php`;
            var viewLayoutFooterPath = `${path.join(viewDir, 'layout', 'footer')}.php`;

            fs.access(libraryPath, function (libraryExists) {
                if (!libraryExists) {
                    vs_window.showErrorMessage("Library file name already exists!");
                } else {
                    fs.access(viewPath, function (viewExists) {
                        if (!viewExists) {
                            vs_window.showErrorMessage("View file name already exists!");
                        } else {
                            if (!fs.existsSync(viewDir)) {
                                try {
                                    fs.mkdirSync(viewDir, {
                                        recursive: true
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
                                vs_window.showInformationMessage(`${folderName} folder created in views.`);
                            }
                            if (!fs.existsSync(path.join(viewDir, 'layout'))) {
                                try {
                                    fs.mkdirSync(path.join(viewDir, 'layout'), {
                                        recursive: true
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
                                vs_window.showInformationMessage(`layout folder created in ${folderName} folder in views.`);
                            }
                            if (!fs.existsSync(libraryDir)) {
                                try {
                                    fs.mkdirSync(libraryDir, {
                                        recursive: true
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
                            }

                            // Creating Header file
                            fs.open(viewLayoutHeaderPath, "w+", function (err, fd) {
                                if (err) throw err;
                                fs.writeFileSync(fd, `<html>
<head>
    <title>Document Title</title>
</head>
<body>

<?php /* End of file header.php and path ${viewLayoutHeaderPath.replace(pathdir,'')} */ ?>
`);
                                fs.close(fd);

                                // Creating Footer file
                                fs.open(viewLayoutFooterPath, "w+", function (err, fd) {
                                    if (err) throw err;
                                    fs.writeFileSync(fd, `<footer>
        </footer>
    </body>
</html>
                                    
<?php /* End of file footer.php and path ${viewLayoutFooterPath.replace(pathdir,'')} */ ?>
    `);
                                    fs.close(fd);

                                    fs.open(viewPath, "w+", function (err, fd) {
                                        if (err) throw err;
                                        fs.writeFileSync(fd, `<?php

/**
* It will load your header to inculde header.
*/

$this->load->view('${newFolder}layout/header');

/**
* This content will include loading view and its data.
*/
echo $template_contents;


/**
* It will load your footer to inculde footer.
*/
$this->load->view('${newFolder}layout/footer');

/* End of file ${capitalize.lowercase(val)}.php and path ${viewPath.replace(pathdir,'')} */
`);
                                        fs.close(fd);

                                        fs.open(libraryPath, "w+", function (err, fd) {
                                            if (err) throw err;
                                            fs.writeFileSync(fd, `<?php defined('BASEPATH') OR exit('No direct script access allowed');

class ${capitalize.capitalize(val)} {
        private $template_data = [];
        
        /**
        * You have to load this library, after loading library
        * You can load this library in controller with by using
        * $this->${capitalize.lowercase(val)}->load('VIEW_PAGE');
        * Where VIEW_PAGE is the content of a page without header
        * & footer.
        */


        /**
         * This function will use to set template data.
         * 
         * @param mix $name this will be the name of the variable which will show in view ${capitalize.lowercase(val)}.
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
         * @param mix $template your default template name is ${capitalize.lowercase(val)}, if changed, use your template file own name.
         * @param bool $return type of your view.
         * @return void 
         */
    
        function load($view = '' , $view_data = [], $template = '${newFolder}${capitalize.lowercase(val)}', $return = FALSE)
        {               
            $this->CI =& get_instance();
            $this->_set('template_contents', $this->CI->load->view($view, $view_data, TRUE));            
            return $this->CI->load->view($template, $this->template_data, $return);
        }
}

/* End of file ${capitalize.lowercase(val)}.php and path ${libraryPath.replace(pathdir,'')} */
`);
                                            fs.close(fd);
                                            vs_window.showInformationMessage(`${libraryPath.replace(pathdir,'')} library created.`);
                                            vscode.workspace.openTextDocument(vscode.Uri.file(viewLayoutHeaderPath)).then(function (val) {
                                                vs_window.showTextDocument(val);
                                            });
                                        });
                                    }); //View Closed
                                }); //View Header Closed
                            }); //View Footer Closed
                        }
                        vs_window.showInformationMessage(`View files header & footer in layout folder created.`);
                        vs_window.showInformationMessage('Template library and view created successfully!');
                    });
                }
            });
        });
    });
}