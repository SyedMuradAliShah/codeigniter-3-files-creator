var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    vscode.window.showInputBox({
        prompt: "Enter name of folder",
        placeHolder: "Enter name of create or choose folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vscode.window.showInformationMessage("Controllers main folder selected.");
        }
        vscode.window.showInputBox({
            prompt: "Enter name of api controller",
            placeHolder: "Enter controller name"
        }).then(function (val) {
            if (val.length == 0) {
                vscode.window.showErrorMessage("Controller file name required.");
            } else {

                var controllerDir = pathdir + "/application/controllers/" + folderName;
                var pathfile = path.join(controllerDir, capitalize.capitalize(val)) + ".php";
                fs.access(pathfile, function (err) {
                    if (!err) {
                        vscode.window.showWarningMessage("Name of file already exists  !");
                    } else {
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
                        fs.open(pathfile, "w+", function (err, fd) {
                            if (err) throw err;
                            fs.writeFileSync(fd, `<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Required Files
 * 
 * application\language\english\rest_controller_lang.php
 * https://gist.githubusercontent.com/SyedMuradAliShah/c2b4003128f8ec263a7253efda29f29f/raw/edfd1f9e13504a837095a5e57aa8489ab29667ad/rest_controller_lang.php
 * 
 * application\libraries\REST_Controller.php
 * https://gist.githubusercontent.com/SyedMuradAliShah/c2b4003128f8ec263a7253efda29f29f/raw/edfd1f9e13504a837095a5e57aa8489ab29667ad/REST_Controller.php
 * 
 * application\libraries\Format.php
 * https://gist.githubusercontent.com/SyedMuradAliShah/c2b4003128f8ec263a7253efda29f29f/raw/edfd1f9e13504a837095a5e57aa8489ab29667ad/Format.php
 * 
 * application\config\rest.php
 * https://gist.githubusercontent.com/SyedMuradAliShah/c2b4003128f8ec263a7253efda29f29f/raw/edfd1f9e13504a837095a5e57aa8489ab29667ad/rest.php
 * 
 * 
 * PLEASE NOTE
 * Alway declear request method name with the function.
 * 
 * For example
 * If you want to get access ${lower.capitalize(val)}/${lower.capitalize(val)}_get with GET then simply go for ${lower.capitalize(val)}/${lower.capitalize(val)}.
 * If you used POST method it will access ${lower.capitalize(val)}_post.
 * 
 * In case you want to define your own then use methodname_requestmethod i.e ${lower.capitalize(val)}_career_post
 * 
 * Default is index so you don't need to define the function name in your uri just change the
 * request method name.
 * 
 * In below case GET example.com/${lower.capitalize(val)}/1 it will call index_get.  
 * Also if PUT example.com/${lower.capitalize(val)}/1 it will call index_put.
 * 
 */

require APPPATH . 'libraries/REST_Controller.php';


class ${capitalize.capitalize(val)} extends REST_Controller {

    public function __construct()
    {
        parent::__construct();
    }


    /**
     * Get All Data from this method.
     *
     * @return Response
     */
    public function index_get($id = 0)
    {
        if (!empty($id)) {
            $data = $this->db->get_where("users", ['id' => $id])->row_array();
        } else {
            $data = $this->db->get("users")->result();
        }

        $this->response($data, REST_Controller::HTTP_OK);
    }

    /**
     * Get All Data from this method.
     *
     * @return Response
     */
    public function index_post()
    {
        $input = $this->input->post();
        $this->db->insert('users', $input);

        $this->response(['User created successfully.'], REST_Controller::HTTP_OK);
    }

    /**
     * Get All Data from this method.
     *
     * @return Response
     */
    public function index_put($id)
    {
        $input = $this->put();
        $this->db->update('users', $input, array('id' => $id));

        $this->response(['User updated successfully.'], REST_Controller::HTTP_OK);
    }

    /**
     * Get All Data from this method.
     *
     * @return Response
     */
    public function index_delete($id)
    {
        $this->db->delete('users', array('id' => $id));

        $this->response(['User deleted successfully.'], REST_Controller::HTTP_OK);
    }
}

/* End of file ${capitalize.capitalize(val)}.php and path ${pathfile.replace(pathdir, '')} */
`);
                            fs.close(fd);
                            var openPath = vscode.Uri.file(pathfile); //A request file path
                            vscode.workspace.openTextDocument(openPath).then(function (val) {
                                vscode.window.showTextDocument(val);
                            });
                        });
                        vscode.window.showInformationMessage('API Contoller created successfully! ');
                    }
                });
            }
        });
    });
}