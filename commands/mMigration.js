var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {
    vscode.window.showInputBox({
        prompt: "name of the table",
        placeHolder: "Enter the name of the table"
    }).then(function (val) {
        if (val.length == 0) {
            vscode.window.showErrorMessage("Table name is required.");

        } else {
            var d = new Date();
            var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            var FileTimeStamp = d.getFullYear() + months[d.getMonth()] + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds();

            var migrationDir = pathdir + "/application/migrations";
            var migrationFile = FileTimeStamp + '_' + val;
            var pathfile = path.join(migrationDir, migrationFile) + ".php";

            fs.access(pathfile, function (err) {
                if (!err) {
                    vscode.window.showWarningMessage("Table file name already exists!");

                } else {

                    if (!fs.existsSync(migrationDir)) {
                        fs.mkdirSync(migrationDir);
                        vscode.window.showInformationMessage("migrations folder created in applications.");
                    }

                    fs.open(pathfile, "w+", function (err, fd) {
                        if (err) throw err;
                        fs.writeFileSync(fd, `<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Migration_` + capitalize.capitalize(val) + ` extends CI_Migration
{
    protected $tableName  = '` + val + `';

    public function up()
    {
        $this->dbforge->add_field(array(
            'id' => array(
                'type' => 'INT',
                'constraint' => 4,
                'unsigned' => TRUE,
                'auto_increment' => TRUE
            ),
            'username' => [
                'type' => 'VARCHAR',
                'constraint' => '30',
            ],
            'password' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'status' => [
                'type'           => 'ENUM',
                'constraint'     => ['active', 'suspend'],
                'default'        => 'active',
            ]
        ));
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_field("updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP");
        $this->dbforge->add_field("created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");

        // If you want to add a foriegn key.
        // role_id must be a column of this table, please add it above in the table. And make sure admin_roles table is added before this table. 
        // $this->dbforge->add_field('CONSTRAINT FOREIGN KEY (role_id) REFERENCES admin_roles(id) ON DELETE RESTRICT ON UPDATE CASCADE');

        $this->dbforge->create_table($this->tableName);

        //Inserting first row
        // $this->db->insert($this->tableName, [
        //     'username' => 'murad_ali',
        //     'phone' => '123-123-7834',
        //     'password' => password_hash('123456', PASSWORD_BCRYPT),
        // ]);
    }

    public function down()
    {
        $this->dbforge->drop_table($this->tableName);
    }
}

/* End of file ` + migrationFile + `.php */
    
                        `);
                        fs.close(fd);
                        var openPath = vscode.Uri.file(pathfile); //A request file path

                        vscode.workspace.openTextDocument(openPath).then(function (val) {
                            vscode.window.showTextDocument(val);

                        });

                    });
                    vscode.window.showInformationMessage('Migration table ' + migrationFile + ' has been created successfully! ');

                }


            });


        }

    });


}