import {writeFileSync} from "fs";
import { ModeOfOperation, DataEncrypter, RC6EncryptionAlgorithm } from "vas-crypto-lib";

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

export const connectToServer = (username, onMessageReceived) => {
    const ws = new WebSocket("ws://localhost:16969");
    
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
    
    const sendFile = () => {
    
    };
    
    return {
        successful: true,
        error: null,
        sendMessage: sendMessage,
        sendFile: sendFile,
    }
}
