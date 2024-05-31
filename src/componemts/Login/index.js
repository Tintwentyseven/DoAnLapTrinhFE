import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import Swal from 'sweetalert2';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername(value);
    if (value.trim() === "") {
      Swal.fire({
        text: "Username không được để trống hoặc chỉ có khoảng trắng",
        icon: 'warning',
      });
    }
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    if (value.trim() === "") {
      Swal.fire({
        text: "Password không được để trống hoặc chỉ có khoảng trắng",
        icon: 'warning',
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username.trim() === "" || password.trim() === "") {
      return Swal.fire({
        text: "Username và Password không được để trống hoặc chỉ có khoảng trắng",
        icon: 'warning',
      });
    }

    const requestData = {
      action: "onchat",
      data: {
        event: "LOGIN",
        data: {
          user: username,
          pass: password
        }
      }
    };

    const socket = new WebSocket("ws://140.238.54.136:8080/chat/chat");

    socket.onopen = () => {
      Swal.fire({
        text: "WebSocket connection established",
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      socket.send(JSON.stringify(requestData));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.status === "success") {
        Swal.fire({
          position: 'center',
          icon: response.status,
          title: response.status,
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          history("/chat", { state: { username: username } }); // Pass the username to the Chat component
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: response.status,
          text: response.mes,
        });
      }
      socket.close();
    };

    socket.onerror = (error) => {
      Swal.fire({
        icon: 'error',
        title: 'WebSocket Error',
        text: 'Unable to establish WebSocket connection',
      });
    };
  };

  return (
      <MDBContainer fluid className="p-3 my-5 h-custom">
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid" alt="Sample image" />
          </MDBCol>
          <MDBCol col='4' md='6'>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <p className="lead fw-normal mb-0 me-3">Sign in with</p>
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='facebook-f' />
              </MDBBtn>
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='twitter' />
              </MDBBtn>
              <MDBBtn floating size='md' tag='a' className='me-2'>
                <MDBIcon fab icon='linkedin-in' />
              </MDBBtn>
            </div>
            <div className="divider d-flex align-items-center my-4">
              <p className="text-center fw-bold mx-3 mb-0">Or</p>
            </div>
            <form onSubmit={handleSubmit}>
              <MDBInput wrapperClass='mb-4' id='formControlLg' size="lg"
                        label="Username"
                        icon="user"
                        value={username}
                        onChange={handleUsernameChange}
              />
              <MDBInput wrapperClass='mb-4' id='formControlLg' type='password' size="lg"
                        label="Password"
                        icon="lock"
                        value={password}
                        onChange={handlePasswordChange}
              />
              <div className="d-flex justify-content-between mb-4">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                <a href="#!">Forgot password?</a>
              </div>
              <div className='text-center text-md-start mt-4 pt-2'>
                <MDBBtn className="mb-0 px-5" size='lg' type="submit">Đăng nhập</MDBBtn>
                <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <Link to="/register">Register</Link></p>
              </div>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
  );
};

export default Login;