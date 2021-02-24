// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require("path");
const mModel = require("./commands/mModel");
const mController = require("./commands/mController");
const mLibrary = require("./commands/mlibrary");
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

	let model = vscode.commands.registerCommand('make.model', function () {
		mModel(vscode, fs, path, pathwork);
	});

	let controller = vscode.commands.registerCommand('make.controller', function () {
		mController(vscode, fs, path, pathwork);
	});

	let library = vscode.commands.registerCommand('make.library', function () {
		mLibrary(vscode, fs, path, pathwork);
	});

	let language = vscode.commands.registerCommand('make.language', function () {
		mLanguage(vscode, fs, path, pathwork);
	});

	let helper = vscode.commands.registerCommand('make.helper', function () {
		mHelper(vscode, fs, path, pathwork);
	});

	let htaccess = vscode.commands.registerCommand('make.htaccess', function () {
		mHtaccess(vscode, fs, path, pathwork);
	});


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