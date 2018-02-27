'use strict';

import { Disposable, window, Uri, workspace } from 'vscode';
import { MasterNode, AgentNode, NodeConfig } from './serverManager';
import { DialogMessage } from './DialogMessage';
import * as fs from 'fs';
export class ServerManagerController {

    private _masterNode: MasterNode;
    private _disposable: Disposable;

    constructor(masterNode: MasterNode) {
        this._masterNode = masterNode;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];

        // update the counter for the current file
        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    public async createServer(): Promise<AgentNode> {
        console.log('create an Instance with a configuration');
        const pathPick: Uri[] = await window.showOpenDialog({
            defaultUri: workspace.rootPath ? Uri.file(workspace.rootPath) : undefined,
            canSelectFiles: true,
            canSelectFolders: false,
            openLabel: DialogMessage.selectDirectory
        });
        const configPath: string = pathPick[0].fsPath;
        var configData = fs.readFileSync(configPath, 'utf8');
        var config = new NodeConfig(new Object());
        var agentNode = new AgentNode(config);
        console.log("Instance created ");
        console.log(agentNode);
        return agentNode;
    }

    private _onEvent() {

    }
}