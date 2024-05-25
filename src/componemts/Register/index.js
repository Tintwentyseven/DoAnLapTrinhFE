import React, { useState, useEffect } from "react";
import {Link, useHistory} from "react-router-dom";
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
} from 'mdb-react-ui-kit';
import firebase from "../../firebase";
import {auth} from "../../firebase";
import {createUserWithEmailAndPassword} from 'firebase/auth';

const Register = () => {
    // const [roomName, setRoomName] = useState("");
    // const [socket, setSocket] = useState(null);
    // const [isLoginSuccess, setIsLoginSuccess] = useState(false);

    // const [username, setUsername] = useState("");
    const [email,setEmail] = useState("")
    const [password, setPassword] = useState("");
    // const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");

    const [image, setImage] = useState(null);
    const [imageError, setImageError] = useState("");

    const [error, setError] = useState('');

    const history = useHistory();

    const handleRegister = async (e) => {
         e.preventDefault();
         try {
            await createUserWithEmailAndPassword(auth,email, password);
            alert('Đăng kí thành công')
         }catch (error){
             console.log(error)
         }

        // Gửi yêu cầu đăng nhập đến server WebSocket
    //     const requestData = {
    //         action: "onchat",
    //         data: {
    //             event: "REGISTER",
    //             data: {
    //                 user: username,
    //                 pass: password,
    //                 name: name,
    //                 image: image
    //             },
    //         },
    //     };
    //     socket.send(JSON.stringify(requestData));
    };
    //
    // // Sau khi đăng nhập thành công, set socket và lưu trữ thông tin đăng nhập
    // useEffect(() => {
    //     if (socket) {
    //         socket.onmessage = (event) => {
    //             const responseData = JSON.parse(event.data);
    //             if (responseData && responseData.event === 'REGISTER' && responseData.status === "success") {
    //                 // Đăng kí thành công
    //                 setIsLoginSuccess(true);
    //                 // Lưu trữ thông tin đăng nhập, ví dụ: lưu trữ token
    //                 history.push('/login'); // Chuyển đến trang chủ
    //                 alert("Đăng kí thành công")
    //                 window.location.href = '/login'
    //             }
    //             else {
    //                 setError(responseData.mes);
    //             }
    //         };
    //     }
    // }, [socket]);

    return (

        <MDBContainer style={{ marginTop: '100px' }} fluid>

            <MDBCard style={{ borderRadius: '25px', marginTop: '50px' }}>
                <MDBCardBody>
                    <MDBRow>
                        <MDBCol md='10' lg='6' className='order-2 order-lg-1 d-flex flex-column align-items-center'>

                            <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Đăng ký</p>
                            <form onSubmit={handleRegister}>
                            <div className="d-flex flex-row align-items-center mb-4">
                                <MDBIcon fas icon="envelope me-3" size='lg'/>
                                <MDBInput
                                    onChange={(e) =>setEmail(e.target.value)}
                                    label='Email' id='form2' type='email'/>
                            </div>

                            <div className="d-flex flex-row align-items-center mb-4">
                                <MDBIcon fas icon="lock me-3" size='lg'/>

                                <MDBInput
                                    onChange={(e) =>setPassword(e.target.value)}

                                    label='Mật khẩu' id='form3' type='password'/>
                            </div>

                            {/*<div className="d-flex flex-row align-items-center mb-4">*/}
                            {/*    <MDBIcon fas icon="user me-3" size='lg'/>*/}
                            {/*    <MDBInput*/}
                            {/*        label='Họ và tên' id='form4' type='text'/>*/}
                            {/*    {nameError && <div className="text-danger">{nameError}</div>}*/}
                            {/*</div>*/}

                            {/*<div className="d-flex flex-row align-items-center mb-4"*/}

                            {/*>*/}
                            {/*    <MDBIcon fas icon="image me-3" size='lg'/>*/}
                            {/*    <MDBInput*/}
                            {/*        type="file"*/}
                            {/*        // onChange={(e) => setImage(e.target.files[0])}*/}
                            {/*        className="form-control"*/}
                            {/*        id="formFile"*/}
                            {/*    />*/}
                            {/*    {imageError && <div className="text-danger">{imageError}</div>}*/}
                            {/*</div>*/}

                            <MDBBtn className='mb-4' size='lg' type="submit">Đăng ký</MDBBtn>
                            <p className="small fw-bold mt-2 pt-1 mb-2">Already have an account? <Link
                                to="/login">Login</Link></p>

                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                            </form>
                        </MDBCol>

                        <MDBCol md='10' lg='6' className='order-1 order-lg-2 d-flex align-items-center'>
                        <MDBCardImage
                                src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp'
                                fluid />
                        </MDBCol>

                    </MDBRow>
                </MDBCardBody>
            </MDBCard>

        </MDBContainer>
    );
};

export default Register;