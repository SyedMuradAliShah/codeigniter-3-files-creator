# Codeignter 3 Files Creator for vcode
[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/SyedMuradAliShah.codeigniter-3-files-creator.svg)](https://marketplace.visualstudio.com/items?itemName=SyedMuradAliShah.codeigniter-3-files-creator)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/SyedMuradAliShah.codeigniter-3-files-creator.svg)](https://marketplace.visualstudio.com/items?itemName=SyedMuradAliShah.codeigniter-3-files-creator)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/SyedMuradAliShah.codeigniter-3-files-creator.svg)](https://marketplace.visualstudio.com/items?itemName=SyedMuradAliShah.codeigniter-3-files-creator#review-details)
[![Fork](https://img.shields.io/github/forks/SyedMuradAliShah/codeigniter-3-files-creator.svg)](https://github.com/SyedMuradAliShah/codeigniter-3-files-creator/network/members)
[![All Contributors](https://img.shields.io/badge/all%20contributors-1-blue)](https://github.com/SyedMuradAliShah/codeigniter-3-files-creator/graphs/contributors)
[![Open Issues](https://img.shields.io/github/issues-raw/SyedMuradAliShah/codeigniter-3-files-creator.svg?style=flat)](https://github.com/SyedMuradAliShah/codeigniter-3-files-creator/issues?q=is%3Aissue+is%3Aopen)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/SyedMuradAliShah/codeigniter-3-files-creator.svg?style=flat)](https://github.com/SyedMuradAliShah/codeigniter-3-files-creator/issues?q=is%3Aissue+is%3Aclosed)
[![Donate](https://img.shields.io/liberapay/patrons/SyedMuradAliShah.svg?style=flat)](https://liberapay.com/SyedMuradAliShah/donate)


Creating files never been so easy, CI3 Files Creator bring you comands to create necessary with a few step.

**Features**
- Create REST API Controller file ✨NEW✨
- Create view file
- Create library google authentication / authy
- Create hook
- Create template
- Create migration add table
- Create migration rename table
- Create migration add column to table
- Create migration rename column in table
- Create simple_auth
- Create simple_auth_api
- Create crud (include Model & Controller)
- Create model file
- Create controller file
- Create library file
- Create language file
- Create helper file
- Create htaccess file

### How to use?
Press `F1` then type `CI3` and you will see a bunch of commands.

If ask for folder?
- Give a name or Leave it empty. (If folder not found it will create new, else choose existing one.)

Asked for file name?
- Give file name

And that's all.

### How to use Template
1. Press `F1` and then `CI3 make:template` now choose your folder to if you\
    want to make otherwise leave it empty, you can also use folder within folder,\
    like `admin/dashboard` or `user/template/front_end` or `user/template/backend_end` etc.
2. Load template library `application\config\autoload.php` here.
3. Now in controller you have to call 
- `$this->TEMPLATE_FILE_NAME->load('VIEW_FILE_NAME', $data);`

For example if I set TEMPLATE_FILE_NAME as template and I have a view file name page.php
- `$this->template->load('page');`
- `$this->template->load('page', $data);`

Or you can use sub folder like this. 
- `$this->template->load('folder_name/page', $data);`

> NOTE: if you use a folder for template like `user_side` then your view files must be inside\
> the `user_side\pages` directory!\
> `pages` is a folder where you will add futher files. 

And that's all.

### How to use Google Authenticator / Authy

1. You need to call this library.
   - `$this->load->library('authy');`
 
2. Now generate a secret code, this code will be used for adding it to\
   Authy or Google authenticator. Also save it in DB against user. 
    - `$secretCode = $this->authy->createSecret()`;
 
3. Once secretCode added to Authy, then you have to cross-check before\
   activating it for a customer. Once user enter 6 digits code from authy.\
   Pass userGivenCode to verifyCode. You will also use this when user want to\
   login with an activated, OTP account.
    - `$checkResult = $this->authy->verifyCode($secretCode, $userGivenCode);`
 
  **[For Admin]** in case you need see 30sec code, for a user you can simple get it\
    using, secretCode saved in DB..
   - `$oneTimeCode = $this->authy->getCode($secretCode);`
   
4. Now generate QR Link using one of below.\
    - `$qrCodeUrl = $this->authy->getQRCodeGoogleUrl('YourSiteName: user@example.com', $secretCode); // It will return Google QR URL`\
    - `$qrCodeUrl = $this->authy->getQRCodeQrServer('YourSiteName: user@example.com', $secretCode); // It will return QR Server QR URL`
 
5. This is not important but if you want your user your
    URL instead of QR link, generated in step 4.\
    Call this in separate function, because header set\
    to image only.\
    - `$this->authy->generateQRCodeImage($qrCodeUrl);`


### How to use Migration
   1. Enable migration `application\config\migration.php` here.
   2. `migration_type` must be `timestamp`, if you set to Sequential migration won't work.\
    And that's all.

### How to use Migration Add Column to a table
1. All you need here to enter a valid format i.e `add_column_to_table` you can see following examples.
- You need to user `add_` at the start and then use `_to_` after column and before the table name. 
  - **Examples**:\
`add_name_to_users`\
`add_first_name_to_users`\
`add_first_name_to_users_details`


### How to use Migration rename Column to a table
1. All you need here to enter a valid format i.e `rename_column_to_column2_in_table` you can see\
   following examples.
- You need to user `rename_` at the start and then use `_to_` after old column and then use\
  new column name before `_in_` and then use table name at last. 
  - **Examples**:\
`rename_name_to_username_in_users`\
`rename_first_name_to_full_name_in_users`\
`rename_first_name_to_full_name_in_users_details`


Press `F1` then type bellow commands

| Command                                 |                                                   Function |
| :-------------------------------------- | ---------------------------------------------------------: |
| `CI3 make:library_google_authenticator` |                             It will create authy library . |
| `CI3 make:hook`                         |                       It will create hook in hooks folder. |
| `CI3 make:template`                     |                 It will create template in library folder. |
| `CI3 make:migration:add_table`          |         It will create migration file in migration folder. |
| `CI3 make:migration:rename_table`       |         It will create migration file in migration folder. |
| `CI3 make:migration:add_column`         |      It will create migration for adding column to a table |
|                                         |                                  file in migration folder. |
| `CI3 make:migration:rename_column`      |    It will create migration for renaming column in a table |
|                                         |                                  file in migration folder. |
| `CI3 make:simple_auth`                  |               It will create controller, model of complete |
|                                         |                                    login and registration. |
| `CI3 make:simple_auth_api`              |         It will create controller, model of complete login |
|                                         |              and registration and will return json format. |
| `CI3 make:crud`                         |      It will create controller, model with crud functions. |
| `CI3 make:api_controller`               | It will create controller for REST API, it has dependency. |
| `CI3 make:model`                        |                                 It will create model file. |
| `CI3 make:view`                         |                                  It will create view file. |
| `CI3 make:controller`                   |                            It will create controller file. |
| `CI3 make:library`                      |             It will create library file in library folder. |
| `CI3 make:language`                     |           It will create language file in language folder. |
| `CI3 make:helper`                       |               It will create helper file in helper folder. |
| `CI3 make:htaccess`                     |                   It will create `.htaccess` file in root. |



### Dependencies of API Controller
  
 * [application\config\rest.php](https://gist.githubusercontent.com/SyedMuradAliShah/c2b4003128f8ec263a7253efda29f29f/raw/edfd1f9e13504a837095a5e57aa8489ab29667ad/rest.php)
 * [application\libraries\REST_Controller.php](https://gist.githubusercontent.com/SyedMuradAliShah/c2b4003128f8ec263a7253efda29f29f/raw/edfd1f9e13504a837095a5e57aa8489ab29667ad/REST_Controller.php)
 * [application\libraries\Format.php](https://gist.githubusercontent.com/SyedMuradAliShah/c2b4003128f8ec263a7253efda29f29f/raw/edfd1f9e13504a837095a5e57aa8489ab29667ad/Format.php)
 * [application\language\english\rest_controller_lang.php](https://gist.githubusercontent.com/SyedMuradAliShah/c2b4003128f8ec263a7253efda29f29f/raw/edfd1f9e13504a837095a5e57aa8489ab29667ad/rest_controller_lang.php)




> `This repository is public, your contribution will be appricated`.

**You can support me by donating, My USDT.TRC20 Address: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t**


<img src="https://i.imgur.com/ZCQGmMj.png" width="200" height="200" />