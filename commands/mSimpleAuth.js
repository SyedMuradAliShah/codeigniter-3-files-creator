var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    vscode.window.showInputBox({
        prompt: "name of auth folder",
        placeHolder: "Enter name of create or choose auth folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vscode.window.showInformationMessage("Controllers & models main folder selected.");
        }
        vscode.window.showInputBox({
            prompt: "name of auth controller/model",
            placeHolder: "Enter controller & model name"
        }).then(function (val) {
            if (val.length == 0) {
                vscode.window.showErrorMessage("Controller & model file name required.");
                return;
            }
            var controllerDir = pathdir + "/application/controllers/" + folderName;
            var modelDir = pathdir + "/application/models/" + folderName;

            var controllerPath = path.join(controllerDir, capitalize.capitalize(val)) + ".php";
            var modelPath = path.join(modelDir, capitalize.capitalize(val)) + "_model.php";

            fs.access(controllerPath, function (controllerExists) {
                if (!controllerExists) {
                    vscode.window.showWarningMessage("Controller file name already exists!");
                } else {
                    fs.access(modelPath, function (modelExists) {
                        if (!modelExists) {
                            vscode.window.showWarningMessage("Model file name already exists!");
                        } else {
                            if (!fs.existsSync(modelDir)) {
                                fs.mkdirSync(modelDir);
                                vscode.window.showInformationMessage(folderName + " folder created in models.");
                            }
                            if (!fs.existsSync(controllerDir)) {
                                fs.mkdirSync(controllerDir);
                                vscode.window.showInformationMessage(folderName + " folder created in controllers.");
                            }

                            fs.open(modelPath, "w+", function (err, fd) {
                                if (err) throw err;
                                fs.writeFileSync(fd, `<?php 
                
defined('BASEPATH') OR exit('No direct script access allowed');
                        
class ` + capitalize.capitalize(val) + `_model extends CI_Model 
{
    /*
    You can change users_table to your own.

        CREATE TABLE users_table (
        id int(11) UNSIGNED NOT NULL,
        email varchar(80) NOT NULL,
        password varchar(100) NOT NULL,
        status enum('pending','active','suspended','blocked') NOT NULL DEFAULT 'pending',
        last_login timestamp NULL DEFAULT NULL,
        last_activity timestamp NULL DEFAULT NULL,
        reset_password_code int(6) DEFAULT NULL,
        reset_password_time timestamp NULL DEFAULT NULL,
        deleted tinyint(4) NOT NULL DEFAULT '0',
        deleted_at timestamp NULL DEFAULT NULL,
        updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8;

    ALTER TABLE users ADD PRIMARY KEY (id);
    ALTER TABLE users MODIFY id int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

    */
    protected $users = 'users_table';

    public function __construct()
    {
        parent::__construct();
    }

    public function login($email)
    {
        $this->db->where('email', $email);
        return $this->db->get($this->users, 1);
    }

    public function register($email, $password)
    {
        $data = [
            'email' => $email,
            'password' => $password
        ];
        $this->db->insert($this->users, $data);
        if ($this->db->insert_id())
            return true;

        return false;
    }
}
                        
/* End of file ` + capitalize.capitalize(val) + `_model.php */
                    
                                        `);
                                fs.close(fd);

                                fs.open(controllerPath, "w+", function (err, fd) {
                                    if (err) throw err;
                                    fs.writeFileSync(fd, `<?php 
        
defined('BASEPATH') OR exit('No direct script access allowed');
        
class ` + capitalize.capitalize(val) + ` extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('` + folderName + `/` + capitalize.capitalize(val) + `_model', '` + val + `');
    }

    /*
    This is simple authenticatio.
    */

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $this->form_validation->set_rules('email', 'email', 'trim|required|min_length[10]|max_length[80]|xss_clean|strip_tags');
            $this->form_validation->set_rules('password', 'password', 'required|xss_clean|strip_tags');

            if ($this->form_validation->run() == FALSE) {
                echo validation_errors();
                return;
            }
            if ($query = $this->` + val + `->login($this->input->post('email'))) {
                if ($query->num_rows()) {
                    $row = $query->row();
                    if (password_verify($this->input->post('password'), $row->password)) {
                        if ($row->status == 'active') {

                            // When all details matched.
                            echo 'Successfully logged-in';
                            return;
                        } elseif ($row->status == 'pending') {

                            //If account status is not available
                            echo 'Account Status Is Pending';
                            return;
                        } elseif ($row->status == 'suspended') {

                            //If account status is not available
                            echo 'Account Suspended';
                            return;
                        } elseif ($row->status == 'blocked') {

                            //If account status is not available
                            echo 'Account Blocked';
                            return;
                        } else {

                            //If account status is not available
                            echo 'Unknow Status';
                            return;
                        }
                    } else {

                        //If password is not matched
                        echo 'Unauthorized';
                        return;
                    }
                }
            } else {

                //If email is not matched
                echo 'Unauthorized';
                return;
            }
        }

        //If request method is other than POST
        echo 'Method Not Allowed';
        return;
    }



    public function register()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $this->form_validation->set_rules('email', 'email', 'trim|required|min_length[10]|max_length[80]|xss_clean|strip_tags');
            $this->form_validation->set_rules('password', 'password', 'required|min_length[8]|max_length[50]|xss_clean|strip_tags');
            $this->form_validation->set_rules('confirm_password', 'confirm password', 'required|xss_clean|strip_tags|matches[password]');


            if ($this->form_validation->run() == FALSE) {
                echo validation_errors();
                return;
            }
            if ($this->` + val + `->register($this->input->post('email'), password_hash($this->input->post('password'), PASSWORD_BCRYPT))) {

                echo 'Account created successful!';
                return;
            } else {
                echo 'Cannot create your account';
                return;
            }
        }

        //If request method is other than POST
        echo 'Method Not Allowed';
        return;
    }

}
        
    /* End of file  ` + capitalize.capitalize(val) + `.php */
        
                            `);
                                    fs.close(fd);

                                    var controllerOpenPath = vscode.Uri.file(controllerPath); //A request file path
                                    vscode.workspace.openTextDocument(controllerOpenPath).then(function (val) {
                                        vscode.window.showTextDocument(val);
                                    });
                                });

                            });
                        }
                    });

                }
            });
            vscode.window.showInformationMessage('Auth Controller & Model created successfully! ');
        });
    });
}