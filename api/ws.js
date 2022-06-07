// Incomplete

import BareClient from '../bareClient/BareClient'; 

import { bare } from '../config.js';

const bareClient = new BareClient(location.origin + bare);

/*
const WebSocket = new Proxy(WebSocket, {
    construct(rawUrl, protocols) {
        const url = new URL(rawUrl);
        
        bareClient.connect({}, url.href, url.protocol, url.host, url.port, url.pathname)
    }
})
*/