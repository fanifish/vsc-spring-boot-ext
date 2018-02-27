'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as InstanceManager from './serverManager';
import {ServerManagerController} from './controller';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vs-example-extension" is now active!');
    let masterNode = new InstanceManager.MasterNode("/home/faniel/hack/tools/vs-example-extension/serverConfig.json");
    let controller = new ServerManagerController(masterNode);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.createServer', () => {
        // The code you place here will be executed every time your command is executed
        console.log("command created");
        controller.createServer();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

