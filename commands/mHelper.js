var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "Enter name of helper",
        placeHolder: "Enter helper file"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Helper file name required.");

        } else {
            var pathfile = path.join(pathdir + "/application/helpers", `${capitalize.lowercase(val)}_helper.php`);
            fs.access(pathfile, function (err) {
                if (!err) {
                    vscode.window.showWarningMessage("Helper file name already exists!");
                } else {
                    fs.open(pathfile, "w+", function (err, fd) {
                        if (err) throw err;
                        fs.writeFileSync(fd, `<?php 

if (!function_exists('is_post')) {

    /**
     * If the method of request is POST return true else false.
     * 
     *  @return bool  */
    function is_post()
    {
        return (strtoupper($_SERVER['REQUEST_METHOD']) === 'POST')  ? true : false;
    }
}

if (!function_exists('is_get')) {

    /**
     * If the method of request is GET return true else false.
     * 
     *  @return bool  */
    function is_get()
    {
        return (strtoupper($_SERVER['REQUEST_METHOD']) === 'GET')  ? true : false;
    }
}

/* End of file ${capitalize.lowercase(val)}_helper.php and path ${pathfile.replace(pathdir,'')} */
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