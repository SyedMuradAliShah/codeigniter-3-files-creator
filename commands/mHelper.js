var capitalize = require('./functions');
module.exports = function(vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "name of helper",
        placeHolder: "Enter helper model"
    }).then(function(val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Helper file name required.");

        } else {
            var pathfile = path.join(pathdir + "/application/helpers", capitalize.capitalize(val) + "_helper") + ".php";
            fs.access(pathfile, function(err) {
                if (!err) {
                    vscode.window.showWarningMessage("Name of file already exists  !");

                } else {


                    fs.open(pathfile, "w+", function(err, fd) {
                        if (err) throw err;
                        fs.writeFileSync(fd, `<?php 
function secure(){


}
                        
/* End of file ` + val + `.php */
    
                        `);
                        fs.close(fd);
                        var openPath = vscode.Uri.file(pathfile); //A request file path

                        vscode.workspace.openTextDocument(openPath).then(function(val) {
                            vscode.window.showTextDocument(val);

                        });

                    });
                    vscode.window.showInformationMessage('Created successfully! ');

                }


            });


        }

    });


}