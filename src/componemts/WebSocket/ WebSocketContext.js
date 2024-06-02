// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        try {
            const ws = new WebSocket('ws://140.238.54.136:8080/chat/chat');
            ws.onopen = () => {
                console.log('WebSocket connection established');
            };
            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };
            setSocket(ws);
        } catch (error) {
            console.error('Error initializing WebSocket:', error);
        }
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);


    return (
        <WebSocketContext.Provider value={socket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
