var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    vscode.window.showInputBox({
        prompt: "Enter name of auth folder",
        placeHolder: "Enter name to create or choose auth folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vscode.window.showInformationMessage("Controllers & models main folder selected.");
        }
        vscode.window.showInputBox({
            prompt: "Enter name of auth controller/model",
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
                                try {
                                    fs.mkdirSync(modelDir, {
                                        recursive: true
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
                                vscode.window.showInformationMessage(folderName + " folder created in models.");
                            }
                            if (!fs.existsSync(controllerDir)) {
                                try {
                                    fs.mkdirSync(controllerDir, {
                                        recursive: true
                                    });
                                } catch (err) {
                                    console.log(err);
                                }
                                vscode.window.showInformationMessage(folderName + " folder created in controllers.");
                            }

                            fs.open(modelPath, "w+", function (err, fd) {
                                if (err) throw err;
                                fs.writeFileSync(fd, `<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class ${capitalize.capitalize(val)}_model extends CI_Model 
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

/* End of file ${capitalize.capitalize(val)}_model.php and path ${modelPath.replace(pathdir,'')}  */
`);
                                fs.close(fd);

                                fs.open(controllerPath, "w+", function (err, fd) {
                                    if (err) throw err;
                                    fs.writeFileSync(fd, `<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

class ${capitalize.capitalize(val)} extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('${folderName}/${capitalize.capitalize(val)}_model', '${val}');
    }


    /*
    This is simple authentication API.

    For Status Code: https://www.restapitutorial.com/httpstatuscodes.html 
    */

    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $this->form_validation->set_rules('email', 'email', 'trim|required|min_length[10]|max_length[80]|xss_clean|strip_tags');
            $this->form_validation->set_rules('password', 'password', 'required|xss_clean|strip_tags');

            if ($this->form_validation->run() == FALSE) {
                return $this->json_output(400, ['status' => 400, 'message' => 'Bad Request', 'error' => true, 'errors' => validation_errors_array($this->form_validation->error_array())]);
            }
            if ($query = $this->${val}->login($this->input->post('email'))) {
                if ($query->num_rows()) {
                    $row = $query->row();
                    if (password_verify($this->input->post('password'), $row->password)) {
                        if ($row->status == 'active') {

                            // When all details matched.
                            return $this->json_output(200, ['status' => 200, 'message' => 'Successfully logged-in', 'error' => false]);
                        } elseif ($row->status == 'pending') {

                            //If account status is not available
                            return $this->json_output(401, ['status' => 401, 'message' => 'Account Status Is Pending', 'error' => true]);
                        } elseif ($row->status == 'suspended') {

                            //If account status is not available
                            return $this->json_output(401, ['status' => 401, 'message' => 'Account Suspended', 'error' => true]);
                        } elseif ($row->status == 'blocked') {

                            //If account status is not available
                            return $this->json_output(401, ['status' => 401, 'message' => 'Account Blocked', 'error' => true]);
                        } else {

                            //If account status is not available
                            return $this->json_output(401, ['status' => 401, 'message' => 'Unknow Status', 'error' => true]);
                        }
                    } else {

                        //If password is not matched
                        return $this->json_output(401, ['status' => 401, 'message' => 'Unauthorized', 'error' => true]);
                    }
                }
            } else {

                //If email is not matched
                return $this->json_output(401, ['status' => 401, 'message' => 'Unauthorized', 'error' => true]);
            }
        }

        //If request method is other than POST
        $this->json_output(405, ['status' => 405, 'message' => 'Method Not Allowed', 'error' => true]);
    }



    public function register()
    {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $this->form_validation->set_rules('email', 'email', 'trim|required|min_length[10]|max_length[80]|xss_clean|strip_tags');
            $this->form_validation->set_rules('password', 'password', 'required|min_length[8]|max_length[50]|xss_clean|strip_tags');
            $this->form_validation->set_rules('confirm_password', 'confirm password', 'required|xss_clean|strip_tags|matches[password]');


            if ($this->form_validation->run() == FALSE) {
                return $this->json_output(400, ['status' => 400, 'message' => 'Bad Request', 'error' => true, 'errors' => validation_errors_array($this->form_validation->error_array())]);
            }
            if ($this->${val}->register($this->input->post('email'), password_hash($this->input->post('password'), PASSWORD_BCRYPT))) {

                return $this->json_output(201, ['status' => 201, 'message' => 'Account created successful!', 'error' => false]);
            } else {
                return $this->json_output(406, ['status' => 406, 'message' => 'Can not create your account', 'error' => true]);
            }
        }

        //If request method is other than POST
        $this->json_output(405, ['status' => 405, 'message' => 'Method Not Allowed', 'error' => true]);
    }



    /**
     * @param int $status_code it will contain HTTP STATUS CODES like 100 - 1xxx | 200 - 2xx | 300 - 3xx | 400 - 4xx | 500 - 5xx 
     * for more status codes: https://www.restapitutorial.com/httpstatuscodes.html
     * @param array $arrayMessage pass your message in array.
     * @return mixed You will receive json.
     */
    private function json_output($status_code, $arrayMessage)
    {
        $this->output->set_status_header($status_code);
        $this->output->set_content_type('application/json');
        $this->output->set_output(json_encode($arrayMessage, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }
}


/* End of file ${capitalize.capitalize(val)}.php and path ${controllerPath.replace(pathdir,'')} */
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