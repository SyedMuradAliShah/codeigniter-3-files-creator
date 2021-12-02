# Codeignter 3 Files Creator for vcode
[![Latest Release](https://vsmarketplacebadge.apphb.com/version-short/SyedMuradAliShah.codeigniter-3-files-creator.svg)](https://marketplace.visualstudio.com/items?itemName=SyedMuradAliShah.codeigniter-3-files-creator)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/SyedMuradAliShah.codeigniter-3-files-creator.svg)](https://marketplace.visualstudio.com/items?itemName=SyedMuradAliShah.codeigniter-3-files-creator)
[![Rating](https://vsmarketplacebadge.apphb.com/rating-short/SyedMuradAliShah.codeigniter-3-files-creator.svg)](https://marketplace.visualstudio.com/items?itemName=SyedMuradAliShah.codeigniter-3-files-creator#review-details)
[![Fork](https://img.shields.io/github/forks/SyedMuradAliShah/codeigniter-3-files-creator.svg)](https://github.com/SyedMuradAliShah/codeigniter-3-files-creator)
[![All Contributors](https://img.shields.io/badge/all_contributors-0-blue.svg?style=flat)](https://github.com/SyedMuradAliShah/codeigniter-3-files-creator#contributors)
[![Open Issues](https://img.shields.io/github/issues-raw/SyedMuradAliShah/codeigniter-3-files-creator.svg?style=flat)](https://github.com/SyedMuradAliShah/codeigniter-3-files-creator/issues?q=is%3Aissue+is%3Aopen)
[![Closed Issues](https://img.shields.io/github/issues-closed-raw/SyedMuradAliShah/codeigniter-3-files-creator.svg?style=flat)](https://github.com/SyedMuradAliShah/codeigniter-3-files-creator/issues?q=is%3Aissue+is%3Aclosed)
[![Donate](https://img.shields.io/liberapay/patrons/SyedMuradAliShah.svg?style=flat)](https://liberapay.com/SyedMuradAliShah/donate)



Creating files never been so easy, CI3 Files Creator bring you comands to create necessary with a few step.

**Features**
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
1. Load template library `application\config\autoload.php` here.
2. Now in controller you have to call 
- `$this->TEMPLATE_FILE_NAME->load('VIEW_FILE_NAME', $data);`

in my case let me show.
- `$this->template->load('page', $data);`

And that's all.


### How to use Migration
1. enable migration `application\config\migration.php` here.
2. `migration_type` must be `timestamp`, if you set to Sequential migration won't work.

And that's all.

### How to use Migration Add Column to a table
1. All you need here to enter a valid format i.e `add_column_to_table` you can see following examples.
- You need to user `add_` at the start and then use `_to_` after column and before the table name. 
- Examples:
- `add_name_to_users`
- `add_first_name_to_users`
- `add_first_name_to_users_details`


### How to use Migration rename Column to a table
1. All you need here to enter a valid format i.e `rename_column_to_column2_in_table` you can see following examples.
- You need to user `rename_` at the start and then use `_to_` after old column and then use new column name before `_in_` and then use table name at last. 
- Examples:
- `rename_name_to_username_in_users`
- `rename_first_name_to_full_name_in_users`
- `rename_first_name_to_full_name_in_users_details`


Press `F1` then type bellow commands

| Command                            |                                                Function |
| :--------------------------------- | ------------------------------------------------------: |
| `CI3 make:template`                |                It will create template in library file. |
| `CI3 make:migration:add_table`     |      It will create migration file in migration folder. |
| `CI3 make:migration:rename_table`  |      It will create migration file in migration folder. |
| `CI3 make:migration:add_column`    |   It will create migration for adding column to a table |
|                                    |                               file in migration folder. |
| `CI3 make:migration:rename_column` | It will create migration for renaming column in a table |
|                                    |                               file in migration folder. |
| `CI3 make:simple_auth`             |            It will create controller, model of complete |
|                                    |                                 login and registration. |
| `CI3 make:simple_auth_api`         |      It will create controller, model of complete login |
|                                    |           and registration and will return json format. |
| `CI3 make:crud`                    |   It will create controller, model with crud functions. |
| `CI3 make:model`                   |                              It will create model file. |
| `CI3 make:controller`              |                         It will create controller file. |
| `CI3 make:library`                 |          It will create library file in library folder. |
| `CI3 make:language`                |        It will create language file in language folder. |
| `CI3 make:helper`                  |            It will create helper file in helper folder. |
| `CI3 make:htaccess`                |                It will create `.htaccess` file in root. |



> This repository is public, your contribution will be appricated.


**Please Donate To Support Me, My Bitcoin Address: 1GPLxZQwzAeWgERvxSe5WMmsMDGiURtQuS**

[![Donate](https://i.imgur.com/W6ggNR5.png)](http://bitcoin:1GPLxZQwzAeWgERvxSe5WMmsMDGiURtQuS)

[![Donate](https://i.imgur.com/2v7VgCu.png)](http://bitcoin:1GPLxZQwzAeWgERvxSe5WMmsMDGiURtQuS)