var capitalize = require('./functions');

module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "Enter name of folder",
        placeHolder: "Enter name to create or choose folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vscode.window.showInformationMessage("Views main folder selected.");
        }
        vscode.window.showInputBox({
            prompt: "Enter name of view",
            placeHolder: "Enter name of view"
        }).then(function (val) {
            if (val.length == 0) {
                vscode.window.showErrorMessage("View file name required.");
            } else {
                var viewDir = `${pathdir}/application/views/${folderName}`;
                var pathfile = `${path.join(viewDir, capitalize.capitalize(val))}.php`;
                fs.access(pathfile, function (err) {
                    if (!err) {
                        vscode.window.showWarningMessage("View file name already exists!");
                    } else {
                        if (!fs.existsSync(viewDir)) {
                            try {
                                fs.mkdirSync(viewDir, {
                                    recursive: true
                                });
                            } catch (err) {
                                console.log(err);
                            }
                            vscode.window.showInformationMessage(`${folderName} folder created in views.`);
                        }
                        fs.open(pathfile, "w+", function (err, fd) {
                            if (err) throw err;
                            fs.writeFileSync(fd, `<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>`);
                            fs.close(fd);
                            var openPath = vscode.Uri.file(pathfile); //A request file path
                            vscode.workspace.openTextDocument(openPath).then(function (val) {
                                vscode.window.showTextDocument(val);
                            });
                        });
                        vscode.window.showInformationMessage('View created successfully!');
                    }
                });
            }
        });
    });
}