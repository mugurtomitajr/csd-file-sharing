import { ModeOfOperation, DataEncrypter, RC6EncryptionAlgorithm } from "vas-crypto-lib";
import {readFileFromDiskRaw, writeFileToResources} from './resource-manager';
import {v4 as uuidV4} from 'uuid';

const {isProduction} = require('./constants');

const electron = window.require('electron');
const net = window.require('net');
const { networkInterfaces } = window.require('os');

const socketClient = net.connect({host:'90.84.231.116', port:80},  () => {
    console.log('connected to server!');
    socketClient.write('world!\r\n');
});

export const selfInterfaces = () => {
    const nets = networkInterfaces();
    const results = Object.create(null);
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    return results;
}

const rc6GetCommonKeyForUsers = (user1, user2) => {
    let users = [user1, user2].sort().join("");
    let key = new Uint8Array(16);
    for(let i = 0; i < 16; ++i){
        key[i] = users.charCodeAt(i % users.length);
    }
    return key;
};

export const connectToServer = (username, onMessageReceived, onFileReceived) => {
    const ws = new WebSocket("ws://localhost:16969");
    let fileReceiveBuffer = [];
    
    ws.addEventListener("open", function open() {
        ws.send(JSON.stringify({type: "login", name: username}));
    });
    
    ws.addEventListener("message", function incoming(event) {
        let jsonData = JSON.parse(event.data);
        if (jsonData.type === "message") {
            let sender = jsonData.source;
            let message = new Uint8Array(jsonData.message);
            let messageLength = jsonData.length;
            
            let enc = new DataEncrypter();
            enc.setModeOfOperation(ModeOfOperation.CBC);
            enc.setEncryptionAlgorithm(new RC6EncryptionAlgorithm());
            enc.setInitializationVector(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]));
            
            let key = rc6GetCommonKeyForUsers(username, sender);
            
            let decrypted = enc.decryptBlob(message, key);
            
            let decoded = new TextDecoder().decode(decrypted.slice(0, messageLength));
            
            onMessageReceived(sender, decoded);
        } else if(jsonData.type === "file_part"){
            let message = jsonData.message;
            fileReceiveBuffer.push(...message);
        } else if(jsonData.type === "file_end"){
            let fileLength = jsonData.length;
            let sender = jsonData.source;
    
            let enc = new DataEncrypter();
            enc.setModeOfOperation(ModeOfOperation.CBC);
            enc.setEncryptionAlgorithm(new RC6EncryptionAlgorithm());
            enc.setInitializationVector(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]));
    
            let key = rc6GetCommonKeyForUsers(username, sender);
    
            let encryptedFileBytes = new Uint8Array(fileReceiveBuffer);
            let fileBytes = enc.decryptBlob(encryptedFileBytes, key).slice(0, fileLength);
            fileReceiveBuffer = [];
    
            let name = uuidV4();
            writeFileToResources(name, Buffer.from(fileBytes), { flag: 'w+' });
            console.log("Received " + name + ".txt from " + sender);
            onFileReceived(sender, name);
        }
    });
    
    const sendMessage = (destination, data) => {
        let enc = new DataEncrypter();
        enc.setModeOfOperation(ModeOfOperation.CBC);
        enc.setEncryptionAlgorithm(new RC6EncryptionAlgorithm());
        enc.setInitializationVector(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]));
    
        let key = rc6GetCommonKeyForUsers(username, destination);
    
        let encrypted = enc.encryptBlob(new TextEncoder().encode(data), key);
    
        let messageToSend = {
            type: "message",
            source: username,
            destination: destination,
            message: Array.from(encrypted),
            length: data.length
        };
        ws.send(JSON.stringify(messageToSend));
    };
    
    const sendFile = async (destination, filepath, callback) => {
        let fileBytes = readFileFromDiskRaw(filepath);
        
        let enc = new DataEncrypter();
        enc.setModeOfOperation(ModeOfOperation.CBC);
        enc.setEncryptionAlgorithm(new RC6EncryptionAlgorithm());
        enc.setInitializationVector(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]));
    
        let key = rc6GetCommonKeyForUsers(username, destination);
    
        let encrypted = enc.encryptBlob(fileBytes, key);
    
        let chunkSize = 20; // Can be anything
    
        for(let i = 0; i < fileBytes.length; i += chunkSize){
            let chunk = encrypted.slice(i, i + chunkSize);
        
            let filePartMessage = {
                type: "file_part",
                source: username,
                destination: destination,
                message: Array.from(chunk)
            };
            ws.send(JSON.stringify(filePartMessage));
        }
    
        let fileEndMessage = {
            type: "file_end",
            source: username,
            destination: destination,
            length: fileBytes.length
        };
        ws.send(JSON.stringify(fileEndMessage));
        callback(true);
    };
    
    return {
        successful: true,
        error: null,
        sendMessage: sendMessage,
        sendFile: sendFile,
    }
}
