/**
 * Author: Faniel Ghirmay
 * 
 * Description:
 *  This file contains all the implementations of 
 */



import * as fs from 'fs';
import * as spawn from 'child_process';

/** 
 *  Implementation of the cluster manger
*/
export class MasterNode{
    private _configFile: string;
    private _masterConfig: MasterConfig;
    private _instances: Array<AgentNode>;

    constructor(configFile: string){
        this._configFile = configFile;
        var configData = fs.readFileSync(this._configFile, 'utf8');
        this._masterConfig = new MasterConfig(configData);
        this._instances = new Array();
        var configList = this._masterConfig.getConfigList();
        for(var i=0; i < configList.length; i+=1){
            var agentNode = new AgentNode(configList[i]);
            console.log(agentNode);
            this._instances.push(agentNode);
        }
    }

    public getConfigFile(){
        return this._configFile;
    }

    public setConfigFile(configFile: string){
        this._configFile = configFile;
    }

    public startServers(){
        var serverCount = this._instances.length;
        for(var i=0; i < serverCount; i += 1){
            var agentNode = this._instances[i];
            agentNode.startInstance();
        }
    }

    public stopServers(){
        var serverCount = this._instances.length;
        for(var i=0; i < serverCount; i += 1){
            var agentNode = this._instances[i];
            agentNode.stopInstance();
        }
    }
}

/**
 * Implemets the server instance node
 * 
 */

export class AgentNode{
    private _nodeConfig: NodeConfig;
    private _jvm: spawn.ChildProcess;
    constructor(nodeConfig: NodeConfig){
        this._nodeConfig = nodeConfig;
    }

    public startInstance(){
        console.log(this._nodeConfig);
        console.log("using spring jar " + this._nodeConfig.getArchivePath());
        var jvm = spawn.spawn('java', ['-jar', this._nodeConfig.getArchivePath()+'', '--server.port='+this._nodeConfig.getPort()]);
        this._jvm = jvm;
        jvm.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
          
        jvm.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
          
        jvm.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    public stopInstance(){
        this._jvm.kill();
    }

    public cleanInstance(){

    }
}

export class MasterConfig{
    private _masterConfigName: string;
    private _version: string;
    private _configList: Array<NodeConfig>;

    constructor(configData: string){
        let configJson = JSON.parse(configData);
        this._masterConfigName = configJson.name;
        this._version = configJson.version;
        this._configList = new Array();
        for(var i=0; i < configJson.configList.length; i += 1){
            var nodeConfig = new NodeConfig(configJson.configList[i]);
            console.log('&&');
            console.log(nodeConfig);
            this._configList.push(nodeConfig);
        }
        console.log('total node config ' + this._configList.length);
    }

    public getConfigList(){
        return this._configList;
    }

}

/** 
 * Holds all the node configuration information
*/
export class NodeConfig{
    private _configName: string;
    private _hostName: string;
    private _port: Number;
    private _archivePath: string;

    constructor(configObject: Object){
        console.log(configObject);
        this._configName = configObject.configName;
        this._hostName = configObject.hostName;
        this._port = configObject.port;
        this._archivePath = configObject.archivePath;
        console.log(this._configName+', '+this._hostName+", "+this._port+", "+this._archivePath);
    }

    public getConfigName(){
        return this._configName;
    }

    public getHostName(){
        return this._hostName;
    }

    public getPort(){
        return this._port;
    }

    public getArchivePath(){
        return this._archivePath;
    }

}
