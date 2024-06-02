import './App.css';

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./componemts/Login"; // Corrected path
import ChatRoom from "./componemts/ChatRoom"; // Corrected path
import Register from "./componemts/Register";
import Logout from "./componemts/Logout";
import {WebSocketProvider} from "./componemts/WebSocket/ WebSocketContext";

function App() {
  return (

    // <BrowserRouter>
    //
    //     <Routes>
    //         <Route path="/login" element={<Login />} />
    //         <Route path="/register" element={<Register />} />
    //         <Route path="/chat" element={<ChatRoom />} />
    //         <Route path="/logout" element={<Logout />} />
    //         <Route path="/" element={<Navigate to="/login" replace />} />
    //     </Routes>
    // </BrowserRouter>
      <WebSocketProvider>
          <BrowserRouter>
              <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/chat" element={<ChatRoom />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
          </BrowserRouter>
      </WebSocketProvider>
  );
}

export default App;

