var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "Enter rename_column_to_new_name_in_table",
        placeHolder: "Enter rename_column_to_new_name_in_table"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Enter old column & new column with table name.");
        } else {
            if (!(/(^rename_)([A-Za-z\_]+)(_to_)([A-Za-z\_]+)(_in_)([A-Za-z\_]+)$/).test(val)) {
                vscode.window.showErrorMessage("Invalid format, use rename_column_to_new_name_in_table");
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
                    var old_column_name = val.split('rename_').pop().split('_to_')[0]; // returns 'name'
                    var new_column_name = val.split('_to_').pop().split('_in_')[0]; // returns 'first_name'
                    var table_name = val.split('_in_')[1]; // returns 'user_details'

                    fs.open(pathfile, "w+", function (err, fd) {
                        if (err) throw err;
                        fs.writeFileSync(fd, `<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Migration_${capitalize.capitalize(val)}_table extends CI_Migration
{
    protected $tableName  = '${table_name}';

    public function up()
    {
        $fields = [
                '${new_column_name}' => [
                    'name'          => ${old_column_name}
                    'type'          => 'VARCHAR',
                //  'constraint'    => '30',
                //  'default'       => 'murad ali',
                ]
        ];
        $this->dbforge->modify_column($this->tableName, $fields);
    }

    
    public function down()
    {
        $fields = [
                '${old_column_name}' => [
                    'name'          => ${new_column_name}
                    'type'          => 'VARCHAR',
                //  'constraint'    => '30',
                //  'default'       => 'murad ali',
                ]
        ];
        $this->dbforge->modify_column($this->tableName, $fields);
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