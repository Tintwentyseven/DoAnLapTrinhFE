import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBIcon
} from 'mdb-react-ui-kit';
import Swal from 'sweetalert2';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

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

    const handleRegister = (event) => {
        event.preventDefault();
        if (username.trim() === "" || password.trim() === "") {
            return Swal.fire({
                text: "Username và Password không được để trống hoặc chỉ có khoảng trắng",
                icon: 'warning',
            });
        }

        // Gửi yêu cầu đăng nhập đến server WebSocket
        const requestData = {
            action: "onchat",
            data: {
                event: "REGISTER",
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
                    navigate("/login"); // Pass the username to the Chat component
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
        <MDBContainer style={{ marginTop: '100px' }} fluid>
            <MDBCard style={{ borderRadius: '25px', marginTop: '50px' }}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>
                            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Đăng ký</p>
                            <form onSubmit={handleRegister}>
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="user me-3" size='lg'/>
                                    <MDBInput
                                        label='Username'
                                        id='form2'
                                        type='text'
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                </div>
                                <div className="d-flex flex-row align-items-center mb-4">
                                    <MDBIcon fas icon="lock me-3" size='lg'/>
                                    <MDBInput
                                        label='Mật khẩu'
                                        id='form3'
                                        type='password'
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <MDBBtn className='mb-4' size='lg' type="submit">Đăng ký</MDBBtn>
                                <p className="small fw-bold mt-2 pt-1 mb-2">Already have an account? <Link to="/login">Login</Link></p>
                            </form>
                        </MDBCol>
                        <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid/>
                        </MDBCol>
                    </MDBRow>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

export default Register;
