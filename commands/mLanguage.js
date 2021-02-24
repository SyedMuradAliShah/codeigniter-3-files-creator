var capitalize = require('./functions');
const fsa = require("fs");
module.exports = function(vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "language name",
        placeHolder: "Enter language name"
    }).then(function(lang) {
        if (lang.length == 0) {
            vscode.window.showErrorMessage("You should insert language name .");

        } else {
            var pathlang = path.join(pathdir + "/application/language", lang);
            fs.access(pathlang, function(err) {
                if (err) fsa.mkdirSync(pathlang);

                vscode.window.showInputBox({
                    prompt: "file name",
                    placeHolder: "set file name"
                }).then(function(val) {
                    if (val.length == 0) {

                        vscode.window.showErrorMessage("Language file name required.");

                    } else {

                        var pathfile = path.join(pathdir + "/application/language", lang + '/' + capitalize.capitalize(val) + "_lang") + ".php";
                        fs.access(pathfile, function(err) {
                            if (!err) {
                                vscode.window.showWarningMessage("Name of file already exists  !");

                            } else {
                                fs.open(pathfile, "w+", function(err, fd) {
                                    if (err) throw err;
                                    fs.writeFileSync(fd, `<?php 
$lang['helloWorld'] = 'hello world'; 
    
/* End of file ` + val + `.php */

            `);
                                    fs.close(fd);

                                });
                                var openPath = vscode.Uri.file(pathfile); //A request file path

                                vscode.workspace.openTextDocument(openPath).then(function(val) {
                                    vscode.window.showTextDocument(val);

                                });
                                vscode.window.showInformationMessage('Created successfully! ');
                            }
                        });



                    }


                });








            });


        }

    });


}