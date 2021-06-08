var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "name of helper",
        placeHolder: "Enter helper file"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Helper file name required.");

        } else {
            var pathfile = path.join(pathdir + "/application/helpers", capitalize.capitalize(val)) + "_helper.php";
            fs.access(pathfile, function (err) {
                if (!err) {
                    vscode.window.showWarningMessage("Helper file name already exists!");

                } else {


                    fs.open(pathfile, "w+", function (err, fd) {
                        if (err) throw err;
                        fs.writeFileSync(fd, `<?php 
function secureFunction(){


}


/* End of file ` + capitalize.capitalize(val) + `.php and path  /application/helpers/` + val + `_helper.php */

`);
                        fs.close(fd);
                        var openPath = vscode.Uri.file(pathfile); //A request file path

                        vscode.workspace.openTextDocument(openPath).then(function (val) {
                            vscode.window.showTextDocument(val);

                        });

                    });
                    vscode.window.showInformationMessage('Helper created successfully! ');

                }


            });


        }

    });


}