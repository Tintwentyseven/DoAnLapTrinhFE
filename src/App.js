import './App.css';

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componemts/Login"; // Corrected path
import ChatRoom from "./componemts/ChatRoom"; // Corrected path
import Register from "./componemts/Register";
import Logout from "./componemts/Logout";
import {WebSocketProvider} from "./componemts/WebSocket/WebSocketContext";
import ProtectedRoute from "./componemts/auth";

function App() {
    const isAuthenticated = !!localStorage.getItem('sessionData');

    return (
        <WebSocketProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/chat" replace /> : <Login />} />

                    <Route path="/register" element={<Register />} />
                    <Route path="/chat" element={<ProtectedRoute element={ChatRoom} />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </WebSocketProvider>
    );
}

export default App;