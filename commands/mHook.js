var capitalize = require('./functions');

module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "Enter name of hook file",
        placeHolder: "Enter name of hook file"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Hook file name required.");
        } else {

            var hookConfigFile = `${pathdir}/application/config/hooks.php`;

            var mainDir = `${pathdir}/application/hooks/`;

            var pathfile = path.join(mainDir, `${capitalize.capitalize(val)}.php`);
            fs.access(pathfile, function (err) {
                if (!err) {
                    vscode.window.showWarningMessage("Hook file name already exists!");
                } else {
                    if (!fs.existsSync(mainDir)) {
                        try {
                            fs.mkdirSync(mainDir, {
                                recursive: true
                            });
                        } catch (err) {
                            console.log(err);
                        }
                        vscode.window.showInformationMessage(`${folderName} folder created in hooks.`);
                    }

                    fs.open(pathfile, "w+", function (err, fd) {
                        if (err) throw err;
                        fs.writeFileSync(fd, `<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class ${capitalize.capitalize(val)}
{
    public function __construct()
    {
        $this->CI = &get_instance();
    }

}


/* End of file ${capitalize.capitalize(val)}.php and path ${pathfile.replace(pathdir,'')} */
`);
                        fs.close(fd);

                        fs.access(hookConfigFile, function (err) {

                            //If file not found add config file.
                            if (err) {
                                fs.open(hookConfigFile, "w+", function (err, fd) {
                                    if (err) throw err;
                                    fs.writeFileSync(fd, `<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

$hook['pre_controller'][] = [
    'class'    => '${capitalize.capitalize(val)}',
    'function' => 'firstMethod',
    'filename' => '${capitalize.capitalize(val)}.php',
    'filepath' => 'hooks',
    // 'params'   => array('beer', 'wine', 'snacks')
];
`);
                                    fs.close(fd);
                                });
                            } else {
                                fs.appendFileSync(hookConfigFile, `

$hook['pre_controller'][] = [
    'class'    => '${capitalize.capitalize(val)}',
    'function' => 'firstMethod',
    'filename' => '${capitalize.capitalize(val)}.php',
    'filepath' => 'hooks',
    // 'params'   => array('beer', 'wine', 'snacks')
];
                        `);
                            }

                            var hookConfigOpenPath = vscode.Uri.file(hookConfigFile); //A request file path
                            vscode.workspace.openTextDocument(hookConfigOpenPath).then(function (val) {
                                vscode.window.showTextDocument(val, {
                                    preview: false
                                });
                            });
                        });


                        var openPath = vscode.Uri.file(pathfile); //A request file path
                        vscode.workspace.openTextDocument(openPath).then(function (val) {
                            vscode.window.showTextDocument(val);
                        });
                    });
                    vscode.window.showInformationMessage('Hook created successfully!');
                }
            });
        }
    });
}