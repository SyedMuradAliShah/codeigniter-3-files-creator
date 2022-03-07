module.exports = function (vscode, fs, path, pathdir) {
    var pathfile = path.join(pathdir, ".htaccess");
    fs.access(pathfile, function (err) {
        if (!err) {
            vscode.window.showWarningMessage(".htaccess file already exists!");

        } else {

            fs.open(pathfile, "w+", function (err, fd) {
                if (err) throw err;
                fs.writeFileSync(fd, `# Generated by Codeigniter 3 Files Creator
<IfModule mod_headers.c>
    Header set Connection keep-alive
    IndexIgnore *
    Options -Indexes
    <FilesMatch "\.(ttf|ttc|otf|eot|woff|woff2|css|js)$">
      Header set Access-Control-Allow-Origin "*"
    </FilesMatch>
    
    <FilesMatch "\.(htaccess)$">
      order deny,allow
      deny from all
      allow from 127.0.0.1
    </FilesMatch>
    
    <FilesMatch "\.(htpasswd|ini|phps|fla|psd|log|sh|docx|json|sql|rst)$">
      order deny,allow
      deny from all
      allow from 127.0.0.1
    </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
    RewriteEngine On 
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php/$1 [L,QSA]
</IfModule>`);
                fs.close(fd);
            });
            var openPath = vscode.Uri.file(pathfile); //A request file path
            vscode.workspace.openTextDocument(openPath).then(function (val) {
                vscode.window.showTextDocument(val);
            });
            vscode.window.showInformationMessage('Htaccess created successfully! ');
        }
    });
}