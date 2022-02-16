var capitalize = require('./functions');
module.exports = function (vscode, fs, path, pathdir) {

    vscode.window.showInputBox({
        prompt: "Enter name of folder",
        placeHolder: "Enter name of create or choose folder leave empty for default"
    }).then(function (folderName) {
        if (folderName.length == 0) {
            vscode.window.showInformationMessage("Controllers & models main folder selected.");
        }

        vscode.window.showInputBox({
            prompt: "name of controller/model",
            placeHolder: "Enter controller & model name"
        }).then(function (val) {
            if (val.length == 0) {
                vscode.window.showErrorMessage("Controller & model file name required.");
                return;
            }
            var controllerDir = `${pathdir}/application/controllers/${folderName}`;
            var modelDir = `${pathdir}/application/models/${folderName}`;

            var controllerPath = `${path.join(controllerDir, capitalize.capitalize(val))}.php`;
            var modelPath = `${path.join(modelDir, capitalize.capitalize(val))}_model.php`;

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
                        
class ` + capitalize.capitalize(val) + `_model extends CI_Model 
{

    protected $${capitalize.lowercase(val)} = '${capitalize.lowercase(val)}';

    public function __construct()
    {
        parent::__construct();
    }




    /**
     * To return all rows according to pagination setup.
     * 
     * @param mixed $limit // limit number of rows
     * @param mixed $start // to start from row.
     * @param mixed $count // if set it will return num_rows
     * @return mixed 
     */
    public function select_all($limit = NULL, $start = NULL, $count = NULL)
    {
      if ($limit != NULL && $start != NULL)
        $this->db->limit($limit, $start);
  
      if ($limit != NULL && $start == NULL)
        $this->db->limit($limit);
  
      $this->db->order_by("id", "desc");
      $query = $this->db->get($this->${capitalize.lowercase(val)});
  
      return ($count != NULL) ? $query->num_rows() : (($query->num_rows()) ? $query->result() : false);
    }
  
    /**
     * To select a single row.
     * 
     * @param int $id 
     * @return mixed 
     */
    public function select($id)
    {
      $this->db->where("id", $id);
      $query = $this->db->get($this->${capitalize.lowercase(val)});
      return ($query->num_rows()) ? $query->row() : false;
    }
  
    /**
     * To insert a row
     * 
     * @param array $data array including data.
     * @return bool|int 
     */
    public function insert($data)
    {
      $this->db->trans_begin();
  
      $this->db->set($data);
      $this->db->insert($this->${capitalize.lowercase(val)});
  
      if ($id = $this->db->insert_id())
        if ($this->db->trans_status()) {
          $this->db->trans_commit();
          return $id;
        }
      $this->db->trans_rollback();
      return false;
    }
  
    /**
     * @param array $data array including data.
     * @param int $id 
     * @return bool 
     */
    public function update($data, $id)
    {
      $this->db->trans_begin();
  
      $this->db->set($data);
      $this->db->where("id", $id);
      $this->db->update($this->${capitalize.lowercase(val)});
  
      if ($this->db->affected_rows())
        if ($this->db->trans_status()) {
          $this->db->trans_commit();
          return true;
        }
      $this->db->trans_rollback();
      return false;
    }
  
    /**
     * To delete data permanently.
     * 
     * @param mixed $id 
     * @return bool 
     */
    public function delete($id)
    {
      $this->db->trans_begin();
  
      $this->db->where("id", $id);
      $this->db->delete($this->${capitalize.lowercase(val)});
  
      if ($this->db->affected_rows())
        if ($this->db->trans_status()) {
          $this->db->trans_commit();
          return true;
        }
      $this->db->trans_rollback();
      return false;
    }
}

/* End of file ${capitalize.capitalize(val)}_model.php and path ${modelPath.replace(pathdir, '')} */
                    
`);
                                fs.close(fd);
                                fs.open(controllerPath, "w+", function (err, fd) {
                                    if (err) throw err;
                                    if (folderName.length != 0)
                                        var loadModelNamePath = `${folderName}/${capitalize.lowercase(val)}_model`;
                                    else
                                        var loadModelNamePath = `${capitalize.lowercase(val)}_model`;

                                    fs.writeFileSync(fd, `<?php 
defined('BASEPATH') OR exit('No direct script access allowed');
        
class ` + capitalize.capitalize(val) + ` extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('${loadModelNamePath}', '${val}');
    }
 





    
    /** 
     * This is the default function, it will return all rows
     * Pagingation is set here, you need to add route.
     * 
     * $route["${folderName}/${capitalize.lowercase(val)}"]['GET'] = "${folderName}/${capitalize.lowercase(val)}";
     * $route["${folderName}/${capitalize.lowercase(val)}/(:num)"]['GET'] = "${folderName}/${capitalize.lowercase(val)}";
     * 
     * @return void  */
    public function index()
    {
        $data['title'] = "${capitalize.capitalize(val)}";
        $data['subtitle'] = "All ${capitalize.capitalize(val)}";

        $page_number = 8;
        $uri_segment = 3;
        $page_uri_segment = ($this->uri->segment($uri_segment)) ? $this->uri->segment($uri_segment) : 0;

        $total_rows = $this->${capitalize.lowercase(val)}->select_all(NULL, NULL, 1);
        $data['result'] = $this->${capitalize.lowercase(val)}->select_all($page_number, $page_uri_segment);
        $data["pagination"] = $this->__pagination(base_url("{$this->uri->segment(1)}/{$this->uri->segment(2)}"), $total_rows, $uri_segment, $page_number);
        $this->load->view('pages/${capitalize.lowercase(val)}/manage', $data);
    }

    /**
     * To view new form and insert row on POST request.
     * 
     *  @return void  */
    public function create()
    {
        if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
            $data['title'] = "Add ${capitalize.capitalize(val)}";
            $data['subtitle'] = "New ${capitalize.capitalize(val)}";

            $this->load->view('pages/${capitalize.lowercase(val)}/new', $data);
        } else {

            $this->form_validation->set_rules('username', 'username', 'required|min_length[3]|max_length[20]|xss_clean|strip_tags');
            $this->form_validation->set_rules('email', 'email', 'trim|required|min_length[10]|max_length[80]|is_unique[${capitalize.lowercase(val)}.email]|xss_clean|strip_tags');

            if ($this->form_validation->run() == FALSE) {
                echo json_encode(['error' => true, 'message' => 'error', 'response' => validation_errors()]);
                return;
            }

            $data = [
                'username' => $this->input->post('username'),
                'email' => $this->input->post('email'),
            ];


            if ($this->${capitalize.lowercase(val)}->insert($data)) {
                echo json_encode(['error' => false, 'message' => 'success', 'response' => true]);
                return;
            } else {
                echo json_encode(['error' => true, 'message' => 'error', 'response' => false]);
                return;
            }
        }
    }

    /**
     * To view single row detail.
     * 
     * @param mixed $id 
     * @return void 
     */
    public function view($id)
    {
        $${capitalize.lowercase(val)} =  $this->${capitalize.lowercase(val)}->select($id);
        if (!$${capitalize.lowercase(val)})
            show_404();

        $data['title'] = "${capitalize.capitalize(val)} Details";
        $data['subtitle'] = "View ${capitalize.capitalize(val)}";
        $data['row'] = $${capitalize.lowercase(val)};
        $this->load->view('pages/${capitalize.lowercase(val)}/view', $data);
    }

    /**
     * To view edit form and update on POST request
     * 
     * @param mixed $id 
     * @return void 
     */
    public function update($id)
    {
        $${capitalize.lowercase(val)} =  $this->${capitalize.lowercase(val)}->select($id);
        if (!$${capitalize.lowercase(val)})
            show_404();

        if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
            $data['title'] = "Edit ${capitalize.capitalize(val)}";
            $data['subtitle'] = "Modify ${capitalize.capitalize(val)}";
            $data['row'] = $${capitalize.lowercase(val)};

            $this->load->view('pages/${capitalize.lowercase(val)}/edit', $data);
        } else {

            $this->form_validation->set_rules('username', 'username', 'required|min_length[3]|max_length[20]|xss_clean|strip_tags');
            $this->form_validation->set_rules('email', 'email', 'trim|required|min_length[10]|max_length[80]|xss_clean|strip_tags');

            if ($this->form_validation->run() == FALSE) {
                echo json_encode(['error' => true, 'message' => 'error', 'response' => validation_errors()]);
                return;
            }

            $data = [
                'username' => $this->input->post('username'),
                'email' => $this->input->post('email'),
            ];


            if ($this->${capitalize.lowercase(val)}->update($data, $id)) {
                echo json_encode(['error' => false, 'message' => 'success', 'response' => true]);
                return;
            } else {
                echo json_encode(['error' => true, 'message' => 'error', 'response' => false]);
                return;
            }
        }
    }

    /**
     * To set column deleted 1.
     * 
     * @param mixed $id 
     * @return void 
     */
    public function soft_delete($id)
    {
        $${capitalize.lowercase(val)} =  $this->${capitalize.lowercase(val)}->select($id);
        if (!$${capitalize.lowercase(val)})
            show_404();

        $data = ['deleted' => 1];

        if ($this->${capitalize.lowercase(val)}->update($data, $id)) {
            echo json_encode(['error' => false, 'message' => 'success', 'response' => true]);
            return;
        } else {
            echo json_encode(['error' => true, 'message' => 'error', 'response' => false]);
            return;
        }
    }

    /**
     * To delete row permanently.
     * 
     * @param mixed $id 
     * @return void 
     */
    public function delete($id)
    {
        $${capitalize.lowercase(val)} =  $this->${capitalize.lowercase(val)}->select($id);
        if (!$${capitalize.lowercase(val)})
            show_404();

        if ($this->${capitalize.lowercase(val)}->delete($id)) {
            echo json_encode(['error' => false, 'message' => 'success', 'response' => true]);
            return;
        } else {
            echo json_encode(['error' => true, 'message' => 'error', 'response' => false]);
            return;
        }
    }

    /**
     * @param mixed $url base_url('admin/users') etc.
     * @param mixed $total_rows return table total rows
     * @param int $uri_segment which segment will return page no default is 3.
     * @param int $per_page show records per page default is 15.
     * @return mixed 
     */
    private function __pagination($url, $total_rows, $uri_segment = 3,  $per_page = 15)
    {
        $config["base_url"] = $url;
        $config['suffix'] = (count($_GET) > 0) ? '?' . http_build_query($_GET, '', "&") : '';
        $config['first_url'] = $config['base_url'] . '?' . http_build_query($_GET);
        $config["per_page"] = $per_page;
        $config["uri_segment"] = $uri_segment;
        $config['num_links'] = 3;
        $config['use_page_numbers'] = FALSE;
        $config['attributes'] = ['class' => 'page-link'];


        $config['full_tag_open'] = '<nav><ul class="pagination">';
        $config['full_tag_close'] = '</ul></nav>';

        $config['first_link'] = 'First';
        $config['first_tag_open'] = '<li class="page-item">';
        $config['first_tag_close'] = '</li>';

        $config['last_link'] = 'Last';
        $config['last_tag_open'] = '<li class="page-item">';
        $config['last_tag_close'] = '</li>';

        $config['next_link'] = 'Next';
        $config['next_tag_open'] = '<li class="page-item">';
        $config['next_tag_close'] = '</li>';

        $config['prev_link'] = 'Previous';
        $config['prev_tag_open'] = '<li class="page-item">';
        $config['prev_tag_close'] = '</li>';

        $config['cur_tag_open'] = '<li class="page-item active"> <a href="#" class="page-link">';
        $config['cur_tag_close'] = '</a></li>';

        $config['num_tag_open'] = '<li class="page-item">';
        $config['num_tag_close'] = '</li>';


        $config["total_rows"] = $total_rows;

        $this->pagination->initialize($config);

        return $this->pagination->create_links();
    }
}


/* End of file ${capitalize.capitalize(val)}.php and path ${controllerPath.replace(pathdir, '')} */
`);
                                    fs.close(fd);
                                    var controllerOpenPath = vscode.Uri.file(controllerPath); //A request file path
                                    vscode.workspace.openTextDocument(controllerOpenPath).then(function (val) {
                                        vscode.window.showTextDocument(val, {
                                            preview: false
                                        });
                                    });
                                });

                                var modelOpenPath = vscode.Uri.file(modelPath); //A request file path
                                vscode.workspace.openTextDocument(modelOpenPath).then(function (val) {
                                    vscode.window.showTextDocument(val);
                                });
                            });
                        }
                    });
                }
            });
            vscode.window.showInformationMessage('Controller & Model created successfully!');
        });
    });
}