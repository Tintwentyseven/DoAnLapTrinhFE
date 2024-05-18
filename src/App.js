import './App.css';

import React from "react";
import Login from './componemts/Login';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import ChatRoom from './componemts/ChatRoom';
import Register from './componemts/Register';
import RegisterT from './componemts/Test';
import Test from './componemts/Test';
import Home from './pages/Home';

// function isUserLoggedIn() {
//   // Kiểm tra giá trị của username trong sessionStorage
//   const username = sessionStorage.getItem('username');
//   return !!username; // Trả về true nếu đã đăng nhập, ngược lại trả về false
// }
function App() {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route exact path="/">
          <Home />
        </Route> */}
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        {/*<Route path="/test">*/}
        {/*  <Test />*/}
        {/*</Route>*/}
        {/*{isUserLoggedIn() ? (*/}
        {/*  <Route path="/">*/}
        {/*    <Home />*/}
        {/*  </Route>*/}
        {/*) : (*/}
        {/*  <Redirect to="/login" />*/}
        {/*)}*/}
      </Switch>
    </BrowserRouter>
  );
}

export default App;