var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "Enter name of language file",
        placeHolder: "Enter name of language file"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Language file name required.");

        } else {
            var pathfile = path.join(pathdir + "/application/language", `${capitalize.lowercase(val)}_lang.php`);
            fs.access(pathfile, function (err) {
                if (!err) {
                    vscode.window.showWarningMessage("Language file name already exists!");
                } else {
                    fs.open(pathfile, "w+", function (err, fd) {
                        if (err) throw err;
                        fs.writeFileSync(fd, `<?php 

$lang['helloWorld'] = 'hello world'; 

/* End of file ${capitalize.lowercase(val)}_lang.php and path ${pathfile.replace(pathdir,'')} */
`);
                        fs.close(fd);
                        var openPath = vscode.Uri.file(pathfile); //A request file path
                        vscode.workspace.openTextDocument(openPath).then(function (val) {
                            vscode.window.showTextDocument(val);
                        });
                    });
                    vscode.window.showInformationMessage('Language file created successfully! ');
                }
            });
        }
    });
}