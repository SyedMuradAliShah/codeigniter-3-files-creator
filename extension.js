// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require("path");

const mTemplate = require("./commands/mTemplate");
const mMigrationAddTable = require("./commands/mMigrationAddTable");
const mMigrationRenameTable = require("./commands/mMigrationRenameTable");
const mMigrationAddColumn = require("./commands/mMigrationAddColumn");
const mMigrationRenameColumn = require("./commands/mMigrationRenameColumn");
const mSimpleAuth = require("./commands/mSimpleAuth");
const mSimpleAuthAPI = require("./commands/mSimpleAuthAPI");
const mCrud = require("./commands/mCrud");
const mModel = require("./commands/mModel");
const mController = require("./commands/mController");
const mLibrary = require("./commands/mLibrary");
const mLanguage = require("./commands/mLanguage");
const mHelper = require("./commands/mHelper");
const mHtaccess = require("./commands/mHtaccess");
let pathwork = vscode.workspace.workspaceFolders[0].uri.fsPath;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(pathwork);

	console.log('Codeigniter-3 Files Creator is activated!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json

	let template = vscode.commands.registerCommand('make.ci3_template', function () {
		mTemplate(vscode, fs, path, pathwork);
	});
	let migration_add_table = vscode.commands.registerCommand('make.ci3_migration_add_table', function () {
		mMigrationAddTable(vscode, fs, path, pathwork);
	});
	let migration_rename_table = vscode.commands.registerCommand('make.ci3_migration_rename_table', function () {
		mMigrationRenameTable(vscode, fs, path, pathwork);
	});
	let migration_add_column = vscode.commands.registerCommand('make.ci3_migration_add_column', function () {
		mMigrationAddColumn(vscode, fs, path, pathwork);
	});
	let migration_rename_column = vscode.commands.registerCommand('make.ci3_migration_rename_column', function () {
		mMigrationRenameColumn(vscode, fs, path, pathwork);
	});
	let simple_auth = vscode.commands.registerCommand('make.ci3_simple_auth', function () {
		mSimpleAuth(vscode, fs, path, pathwork);
	});
	let simple_auth_api = vscode.commands.registerCommand('make.ci3_simple_auth_api', function () {
		mSimpleAuthAPI(vscode, fs, path, pathwork);
	});
	let crud = vscode.commands.registerCommand('make.ci3_crud', function () {
		mCrud(vscode, fs, path, pathwork);
	});
	let model = vscode.commands.registerCommand('make.ci3_model', function () {
		mModel(vscode, fs, path, pathwork);
	});

	let controller = vscode.commands.registerCommand('make.ci3_controller', function () {
		mController(vscode, fs, path, pathwork);
	});

	let library = vscode.commands.registerCommand('make.ci3_library', function () {
		mLibrary(vscode, fs, path, pathwork);
	});

	let language = vscode.commands.registerCommand('make.ci3_language', function () {
		mLanguage(vscode, fs, path, pathwork);
	});

	let helper = vscode.commands.registerCommand('make.ci3_helper', function () {
		mHelper(vscode, fs, path, pathwork);
	});

	let htaccess = vscode.commands.registerCommand('make.ci3_htaccess', function () {
		mHtaccess(vscode, fs, path, pathwork);
	});

	
	context.subscriptions.push(template);
	context.subscriptions.push(migration_add_table);
	context.subscriptions.push(migration_add_column);
	context.subscriptions.push(migration_rename_column);
	context.subscriptions.push(migration_rename_table);
	context.subscriptions.push(simple_auth);
	context.subscriptions.push(simple_auth_api);
	context.subscriptions.push(crud);
	context.subscriptions.push(model);
	context.subscriptions.push(controller);
	context.subscriptions.push(library);
	context.subscriptions.push(language);
	context.subscriptions.push(helper);
	context.subscriptions.push(htaccess);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;