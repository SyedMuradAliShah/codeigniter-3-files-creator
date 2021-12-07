var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "Enter rename_table_to_table2",
        placeHolder: "Enter rename_table_to_table2"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Enter old column & new column with table name.");
        } else {
            if (!(/(^rename_)([A-Za-z\_]+)(_to_)([A-Za-z\_]+)$/).test(val)) {
                vscode.window.showErrorMessage("Invalid format, use rename_table_to_table2");
                return;
            }

            const date = new Date();
            var FileTimeStamp = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);

            var migrationDir = `${pathdir}/application/migrations`;
            var migrationFile = FileTimeStamp + '_' + val;
            var pathfile = `${path.join(migrationDir, migrationFile)}.php`;

            fs.access(pathfile, function (err) {
                if (!err) {
                    vscode.window.showWarningMessage("Migration file name already exists!");
                } else {
                    if (!fs.existsSync(migrationDir)) {
                        try {
                            fs.mkdirSync(migrationDir, {
                                recursive: true
                            });
                        } catch (err) {
                            console.log(err);
                        }
                        vscode.window.showInformationMessage("Migration folder created in applications.");
                    }

                    //rename_name_to_first_name_in_user_details
                    var old_table_name = val.split('rename_').pop().split('_to_')[0]; // returns 'name'
                    var new_table_name = val.split('_to_')[1]; // returns 'user_details'

                    fs.open(pathfile, "w+", function (err, fd) {
                        if (err) throw err;
                        fs.writeFileSync(fd, `<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Migration_${capitalize.capitalize(val)}_table extends CI_Migration
{

    public function up()
    {
        $this->dbforge->rename_table('${old_table_name}', '${new_table_name}');
    }

    
    public function down()
    {
        $this->dbforge->rename_table('${new_table_name}', '${old_table_name}');
    }
}


/* End of file ${migrationFile}.php and path ${pathfile.replace(pathdir,'')} */
`);
                        fs.close(fd);
                        var openPath = vscode.Uri.file(pathfile); //A request file path
                        vscode.workspace.openTextDocument(openPath).then(function (val) {
                            vscode.window.showTextDocument(val);
                        });
                    });
                    vscode.window.showInformationMessage('Migration for renaming column ' + migrationFile + ' has been created successfully! ');
                }
            });
        }
    });
}