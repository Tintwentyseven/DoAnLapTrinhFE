import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBInput,
    MDBIcon,
    MDBCheckbox
}
    from 'mdb-react-ui-kit';
const Register = () => {
    const [roomName, setRoomName] = useState("");
    const [socket, setSocket] = useState(null);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState('');

    const history = useNavigate();

    // Khi component được tạo, thiết lập kết nối WebSocket
    // useEffect(() => {
    //     const newSocket = new WebSocket("ws://140.238.54.136:8080/chat/chat");
    //
    //     newSocket.addEventListener("open", (event) => {
    //         console.log("Kết nối WebSocket đã được thiết lập", event);
    //         setSocket(newSocket);
    //     });
    //
    //     return () => {
    //         // Đóng kết nối WebSocket khi component bị hủy
    //         newSocket.close();
    //     };
    // }, []);

    const handleRegister = () => {
        // Gửi yêu cầu đăng nhập đến server WebSocket
        const requestData = {
            action: "onchat",
            data: {
                event: "REGISTER",
                data: {
                    user: username,
                    pass: password,
                },
            },
        };
        socket.send(JSON.stringify(requestData));
    };

    // Sau khi đăng nhập thành công, set socket và lưu trữ thông tin đăng nhập
    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const responseData = JSON.parse(event.data);
                if (responseData && responseData.event === 'REGISTER' && responseData.status === "success") {
                    // Đăng kí thành công
                    setIsLoginSuccess(true);
                    // Lưu trữ thông tin đăng nhập, ví dụ: lưu trữ token
                    history.push('/login'); // Chuyển đến trang chủ
                    alert("Đăng kí thành công")
                    window.location.href = '/login'
                }
                else {
                    setError(responseData.mes);
                }
            };
        }
    }, [socket]);

    return (

        <MDBContainer style={{ marginTop: '100px' }} fluid>

            <MDBCard className='text-black m-5' style={{ borderRadius: '25px', marginTop: '50px' }}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                            <p classNAme="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Sign up</p>


                            <div className="d-flex flex-row align-items-center mb-4">
                                <MDBIcon fas icon="envelope me-3" size='lg' />
                                <MDBInput
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    label='Username' id='form2' type='email' />
                            </div>

                            <div className="d-flex flex-row align-items-center mb-4">
                                <MDBIcon fas icon="lock me-3" size='lg' />

                                <MDBInput
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label='Password' id='form3' type='password' />
                            </div>
                            <MDBBtn className='mb-4' size='lg' onClick={handleRegister}>Register</MDBBtn>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}

                        </MDBCol>

                        <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                            <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp' fluid />
                        </MDBCol>

                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

        </MDBContainer>
    );
};

export default Register;