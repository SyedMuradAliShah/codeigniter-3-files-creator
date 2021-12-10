var capitalize = require('./functions');

module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "Enter name of library file",
        placeHolder: "Enter name of library file"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Library file name required.");

        } else {
            var mainDir = `${pathdir}/application/libraries/`;
            var pathfile = path.join(mainDir, `${capitalize.capitalize(val)}.php`);
            fs.access(pathfile, function (err) {
                if (!err) {
                    vscode.window.showWarningMessage("Library file name already exists!");
                } else {
                    if (!fs.existsSync(mainDir)) {
                        try {
                            fs.mkdirSync(mainDir, {
                                recursive: true
                            });
                        } catch (err) {
                            console.log(err);
                        }
                        vscode.window.showInformationMessage(`${folderName} folder created in libraries.`);
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
                        var openPath = vscode.Uri.file(pathfile); //A request file path
                        vscode.workspace.openTextDocument(openPath).then(function (val) {
                            vscode.window.showTextDocument(val);
                        });
                    });
                    vscode.window.showInformationMessage('Library created successfully!');
                }
            });
        }
    });
}