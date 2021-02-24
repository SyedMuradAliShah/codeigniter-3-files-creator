module.exports = function(vscode, fs, path, pathdir) {
    var pathfile = path.join(pathdir, ".htaccess");
    fs.access(pathfile, function(err) {
        if (!err) {
            vscode.window.showWarningMessage(".htaccess already exists  !");

        } else {


            fs.open(pathfile, "w+", function(err, fd) {
                if (err) throw err;
                fs.writeFileSync(fd, `
RewriteEngine on
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule .* index.php?/$0 [PT,L]
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