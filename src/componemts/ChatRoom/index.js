import React, { useState, useEffect, useRef } from "react";
import {
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBIcon,
    MDBInput
} from 'mdb-react-ui-kit';
import './style.css';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useWebSocket } from "../WebSocket/WebSocketContext";

export default function ChatRoom() {
// <<<<<<< HEAD
    // const [basicModal, setBasicModal] = useState(false);// mở Menu Item
    // const location = useLocation();// lấy dữ liệu trang
    // const { username, password } = location.state || { username: 'Guest' }; // Default to 'Guest' if username is not available
    //
    // const toggleOpen = () => setBasicModal(!basicModal);
    // const  history = useNavigate();// điều hướng và gửi dữ liệu đến trang khác
    // const socket = useWebSocket();
    // // console.log("socket1: "+socket);
    // console.log("user: "+ username);
    // const [isOpen, setIsOpen] = useState(false);
    //
    // const toggleMenu = () => {
    //     setIsOpen(!isOpen);
    // };
    //
    //
    // const handleLogout = () => {
    //     console.log("da vao dang xuat")
    //     console.log("socket: "+socket);
    //     if (!socket || socket.readyState !== WebSocket.OPEN) {
    //         console.error('WebSocket connection is not open');
    //         return;
    //     }
    //
    //
    //         const requestData = {
    //             action: "onchat",
    //             data: {
    //                 event: "LOGOUT",
    //             }
    //         };
    //         socket.send(JSON.stringify(requestData));
    //     // };
    //
    //     socket.onmessage = (event) => {
    //         console.log("da vao dang xuat onmess")
    //         const response = JSON.parse(event.data);
    //         console.log(response);
    //         if (response.status === "success") {
    //             console.log("da vao dang xuat success")
    //             localStorage.removeItem('sessionData');
    //             Swal.fire({
    //                 position: 'center',
    //                 icon: response.status,
    //                 title: response.status,
    //                 showConfirmButton: false,
    //                 timer: 1500
    //             }).then(() => {
    //                 history('/logout'); // Điều chỉnh URL tới trang logout của bạn
    //             });
    //         } else {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: response.status,
    //                 text: response.mes,
    //             });
    //         }
    //         // socket.close();
    //     };
    //
    //     socket.onerror = (error) => {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Lỗi WebSocket',
    //             text: 'Không thể thiết lập kết nối WebSocket',
    //         });
    //     };
    // };

    //chat
    const [basicModal, setBasicModal] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const socket = useWebSocket();

    const sessionData = JSON.parse(localStorage.getItem('sessionData')) || {};
    // console.log("session1: "+ sessionData);
    const { username, code ,userList:initialUserList} =  sessionData;
    // console.log("user cua m do: "+userList);

    console.log("user: " + username);

    const toggleOpen = () => setBasicModal(!basicModal);
    const toggleMenu = () => setIsOpen(!isOpen);

    //search
    const [searchInput, setSearchInput] = useState(''); // State to manage the search input value
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // State to manage the checkbox state
    const [userList, setUserList] = useState(initialUserList || []); // State to store the user list
    const [roomOwner, setRoomOwner] = useState(''); // State to store room owner
    const [messageContent, setMessageContent] = useState(''); // State to store the message content
    const [displayName, setDisplayName] = useState(username); // State to store the display name
    const [searchType, setSearchType] = useState(''); // State to store the type of search (room or user)
    const existingSocketRef = useRef(null);
// =======
//     const [basicModal, setBasicModal] = useState(false); // mở Menu Item -----
//     const [searchInput, setSearchInput] = useState(''); // State to manage the search input value
//     const [isCheckboxChecked, setIsCheckboxChecked] = useState(false); // State to manage the checkbox state
//     const location = useLocation(); // lấy dữ liệu trang
//     const { username, password, userList: initialUserList } = location.state || {};
//     const [userList, setUserList] = useState(initialUserList || []); // State to store the user list
//     const [roomOwner, setRoomOwner] = useState(''); // State to store room owner
//     const [messageContent, setMessageContent] = useState(''); // State to store the message content
//     const [displayName, setDisplayName] = useState(username); // State to store the display name
//     const [searchType, setSearchType] = useState(''); // State to store the type of search (room or user)
//
//     const toggleOpen = () => setBasicModal(!basicModal);
//     const history = useNavigate(); // điều hướng và gửi dữ liệu đến trang khác
//     const socket = useWebSocket();
//     const existingSocketRef = useRef(null);
//
//     const [isOpen, setIsOpen] = useState(false);
// >>>>>>> main

    useEffect(() => {
        if (!socket) return;

        const handleReload = () => {
            console.log("Preparing to reload...");
            if (username && code) {
                console.log("Preparing to reload... " + code + " " + username);
                const requestData = {
                    action: "onchat",
                    data: {
                        event: "RE_LOGIN",
                        data: {
                            user: username,
                            code: code
                        }
                    }
                };



                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify(requestData));
                } else {
                    socket.addEventListener('open', () => {
                        socket.send(JSON.stringify(requestData));
                    }, { once: true });
                }
            }
        };

        const handleReloginMessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.event === "RE_LOGIN") {
                if (response.status === "success") {
                    localStorage.setItem('sessionData', JSON.stringify({
                        username: username,
                        code: response.data.RE_LOGIN_CODE
                    }));
                    // Swal.fire({
                    //     position: 'center',
                    //     icon: 'success',
                    //     title: response.status,
                    //     text: response.mes,
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // });
                    // console.log("relogin thanh cong: "+response.data.RE_LOGIN_CODE);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: response.status,
                        text: response.mes,
                    });
                    console.error('Relogin error details:', response);
                }
            }
        };

        handleReload();

        window.addEventListener('beforeunload', handleReload);
        socket.addEventListener('message', handleReloginMessage);

        return () => {
            window.removeEventListener('beforeunload', handleReload);
            socket.removeEventListener('message', handleReloginMessage);
        };
    }, [socket, username, code]);

    useEffect(() => {
        const savedUserList = JSON.parse(sessionStorage.getItem('userList'));
        if (savedUserList) {
            setUserList(savedUserList);
        }

        const roomData = JSON.parse(localStorage.getItem('data'));
        if (roomData && roomData.own) {
            const roomOwner = roomData.own;
            setRoomOwner(roomOwner);
            setMessageContent(username === roomOwner ? 'Người tạo phòng' : 'Người tham gia');
        }
    }, [username]);

    const handleLogout = () => {
// <<<<<<< HEAD
//         console.log("Đã vào đăng xuất");
//
// =======
//         console.log("Logging out...");
// >>>>>>> main
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket connection is not open');
            Swal.fire({
                icon: 'error',
                title: 'WebSocket Error',
                text: 'Unable to establish WebSocket connection',
            });
            return;
        }

        const requestData = {
            action: "onchat",
            data: {
                event: "LOGOUT",
            }
        };
        socket.send(JSON.stringify(requestData));

// <<<<<<< HEAD
        const handleLogoutMessage = (event) => {
            console.log("Đã vào đăng xuất onmessage");
// =======
//         socket.onmessage = (event) => {
//             console.log("Logout response received");
// >>>>>>> main
            const response = JSON.parse(event.data);
            console.log(response);

            if (response.status === "success") {
// <<<<<<< HEAD
                console.log("Đã vào đăng xuất success");
                localStorage.removeItem('sessionData');
// =======
//                 console.log("Logout success");
//                 localStorage.removeItem('sessionData'); // Remove session data only when logout is successful
                localStorage.removeItem('userList'); // Remove userList from localStorage
                localStorage.removeItem('data');
                sessionStorage.removeItem('userList'); // Remove userList from sessionStorage
                setUserList([]); // Clear the user list
// >>>>>>> main
                Swal.fire({
                    position: 'center',
                    icon: response.status,
                    title: response.status,
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
// <<<<<<< HEAD
                    navigate('/logout'); // Điều chỉnh URL tới trang logout của bạn
// =======
//                     history('/logout'); // Navigate to logout page
// >>>>>>> main
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: response.status,
                    text: response.mes,
                });
            }
// <<<<<<< HEAD

            // Dọn dẹp listener sau khi xử lý tin nhắn
            socket.removeEventListener('message', handleLogoutMessage);
// =======
// >>>>>>> main
        };

        socket.addEventListener('message', handleLogoutMessage);

        socket.onerror = (error) => {
            Swal.fire({
                icon: 'error',
                title: 'WebSocket Error',
                text: 'Unable to establish WebSocket connection',
            });
        };
    };


    //==========================create room======================

    const [roomNames, setRoomNames] = useState('');
    const handleCreateRoom = () => {
        const createRoom = {
            action: "onchat",
            data: {
                event: "CREATE_ROOM",
                data: {
                    name: roomNames
                }
            }
        };

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(createRoom));
            console.log('Room creation message sent');
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }

        toggleOpen(); // Đóng modal sau khi gửi yêu cầu tạo phòng
    };
    useEffect(() => {
        const handleCreateRoomResponse = (event) => {
            console.log("da vo create room thong bao...")
            const response = JSON.parse(event.data);
            if (response.event === "CREATE_ROOM") {
                if (response.status === "success") {
                    // Hiển thị thông báo thành công
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: response.status,
                        text: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });
                    // Xử lý các hành động khác nếu cần
                } else {
                    // Hiển thị thông báo lỗi
                    Swal.fire({
                        icon: 'warning',
                        // title: response.status,
                        text: 'Tên phòng đã tồn tại!',
                    });
                    console.error('Create room error details:', response);
                }
            }
        };

        // Thêm sự kiện lắng nghe cho WebSocket
        if (socket) {
            socket.addEventListener('message', handleCreateRoomResponse);
        }

        // Cleanup function
        return () => {
            // Xóa sự kiện lắng nghe khi component unmount
            if (socket) {
                socket.removeEventListener('message', handleCreateRoomResponse);
            }
        };
    }, [socket]);


// =======
    //chuc nang search
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };
// >>>>>>> main

    const handleCheckboxChange = (event) => {
        setIsCheckboxChecked(event.target.checked);
    };

    const handleSearch = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error('WebSocket connection is not open');
            Swal.fire({
                icon: 'error',
                title: 'WebSocket Error',
                text: 'Unable to establish WebSocket connection',
            });
            return;
        }

        if (!isCheckboxChecked) {
            const requestData = {
                action: "onchat",
                data: {
                    event: "CHECK_USER",
                    data: {
                        user: searchInput.trim()
                    }
                }
            };

            socket.send(JSON.stringify(requestData));

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                console.log("Check User response: ", response);
                if (response.status === "success") {
                    if (response.data.status) {
                        setDisplayName(searchInput.trim());
                        setMessageContent(''); // Clear the message content for user search
                        setSearchType('user');
                        Swal.fire({
                            text: `User ${searchInput} has logged in before.`,
                            icon: 'success',
                        });
                    } else {
                        Swal.fire({
                            text: `User ${searchInput} has not logged in before.`,
                            icon: 'warning',
                        });
                    }
                } else {
                    Swal.fire({
                        text: `Failed to check user ${searchInput}.`,
                        icon: 'error',
                    });
                }
            };
        } else {
            const requestData = {
                action: "onchat",
                data: {
                    event: "GET_ROOM_CHAT_MES",
                    data: {
                        name: searchInput.trim(),
                        page: 1
                    }
                }
            };

            socket.send(JSON.stringify(requestData));

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                console.log("Get Room Chat Mes response: ", response);
                if (response.status === "success") {
                    const roomData = response.data;
                    const roomName = roomData.name;
                    const chatData = roomData.chatData;

                    // Lưu dữ liệu vào localStorage dưới tên "data"
                    localStorage.setItem('data', JSON.stringify(roomData));

                    // Lưu dữ liệu vào localStorage
                    const savedUserList = JSON.parse(localStorage.getItem('userList')) || [];
                    const existingRoom = savedUserList.find(room => room.name === roomName);
                    if (!existingRoom) {
                        savedUserList.push(roomData);
                        localStorage.setItem('userList', JSON.stringify(savedUserList));
                    }

                    setRoomOwner(roomData.own);
                    setMessageContent(username === roomData.own ? 'Người tạo phòng' : 'Người tham gia');
                    setDisplayName(roomName);
                    setSearchType('room');

                    Swal.fire({
                        text: `Room ${roomName} tồn tại`,
                        icon: 'success',
                    });
                } else {
                    Swal.fire({
                        text: `Room ${searchInput} không tồn tại`,
                        icon: 'warning',
                    });
                }
            };
        }
    };




    return (
        <>
            <div className="maincontainer">
                <div className="container-fluid h-50">
                    <div className="row justify-content-center h-100">
                        <div className="col-md-4 col-xl-3 chat">
                            <div className="card mb-sm-3 mb-md-0 contacts_card">
                                <div className="card-header">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="cbox"
                                            aria-label="Checkbox for search"
                                            checked={isCheckboxChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            name=""
                                            className="form-control search"
                                            value={searchInput}
                                            onChange={handleSearchInputChange}
                                        />
                                        <div className="input-group-prepend">
                                            <span
                                                className="input-group-text search_btn"
                                                onClick={handleSearch}
                                            >
                                                <i className="fas fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body contacts_body">
                                    <ul className="contacts">
                                        {userList.length > 0 ? (
                                            userList.map((user, index) => (
                                                <li key={index} className="active">
                                                    <div className="d-flex bd-highlight">
                                                        <div className="img_cont">
                                                            <img
                                                                src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                                alt="avatar"
                                                                className="rounded-circle user_img"
                                                            />
                                                            <span className="online_icon"></span>
                                                        </div>
                                                        <div className="user_info">
                                                            <span>{user.name}</span>
                                                            <p>Type: {user.type}</p>
                                                            <p>Last Action: {user.actionTime}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li>No users found.</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="card-footer"></div>
                            </div>
                        </div>
                        <div className="col-md-8 col-xl-6 chat">
                            <div className="card">
                                <div className="card-header msg_head">
                                    <div className="d-flex bd-highlight">
                                        <div className="img_cont">
                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                 className="rounded-circle user_img" />
                                            <span className="online_icon"></span>
                                        </div>
                                        <div className="user_info">
                                            <span>{displayName}</span>
                                            {searchType === 'room' && messageContent && <p>{messageContent}</p>}
                                        </div>
                                        <div className="video_cam">
                                            <span><i className="fas fa-video"></i></span>
                                            <span><i className="fas fa-phone"></i></span>
                                            <span>
                                                <MDBBtn
                                                    rounded
                                                    size="sm"
                                                    color="primary"
                                                    onClick={toggleOpen}
                                                    style={{ marginBottom: "3px" }}
                                                >
                                                    <MDBIcon fas icon="plus-circle" />
                                                </MDBBtn>
                                            </span>
                                        </div>
                                    </div>
                                    <span id="action_menu_btn" onClick={toggleMenu}>
                                        <i className="fas fa-ellipsis-v"></i>
                                    </span>
                                    <div className={`action_menu ${isOpen ? 'open' : ''}`}>
                                        <ul>
                                            <li id="toggle-dark-mode"><i className="fa-regular fa-moon"
                                                                         id="icontype"></i> <span className="dark">Dark mode</span>
                                            </li>
                                            <li><i className="fas fa-user-circle"></i> View profile</li>
                                            <li><i className="fas fa-plus"></i> Add to group</li>
                                            <li id="logout-button" onClick={handleLogout}><i
                                                className="fas fa-ban"></i> Logout
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-body msg_card_body">
                                    <div className="d-flex justify-content-start mb-4">
                                        <div className="img_cont_msg">
                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                 className="rounded-circle user_img_msg" />
                                        </div>
                                        <div className="msg_cotainer">
                                            Hi, how are you samim?
                                            <span className="msg_time">8:40 AM, Today</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mb-4">
                                        <div className="msg_cotainer_send">
                                            Hi jassa i am good tnx how about you?
                                            <span className="msg_time_send">8:55 AM, Today</span>
                                        </div>
                                        <div className="img_cont_msg">
                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                 className="rounded-circle user_img_msg" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-start mb-4">
                                        <div className="img_cont_msg">
                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                 className="rounded-circle user_img_msg" />
                                        </div>
                                        <div className="msg_cotainer">
                                            I am good too, thank you for your chat template
                                            <span className="msg_time">9:00 AM, Today</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mb-4">
                                        <div className="msg_cotainer_send">
                                            You are welcome
                                            <span className="msg_time_send">9:05 AM, Today</span>
                                        </div>
                                        <div className="img_cont_msg">
                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                 className="rounded-circle user_img_msg" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-start mb-4">
                                        <div className="img_cont_msg">
                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                 className="rounded-circle user_img_msg" />
                                        </div>
                                        <div className="msg_cotainer">
                                            I am looking for your next templates
                                            <span className="msg_time">9:07 AM, Today</span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end mb-4">
                                        <div className="msg_cotainer_send">
                                            Ok, thank you have a good day
                                            <span className="msg_time_send">9:10 AM, Today</span>
                                        </div>
                                        <div className="img_cont_msg">
                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                 className="rounded-circle user_img_msg" />
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-start mb-4">
                                        <div className="img_cont_msg">
                                            <img src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                 className="rounded-circle user_img_msg" />
                                        </div>
                                        <div className="msg_cotainer">
                                            Bye, see you
                                            <span className="msg_time">9:12 AM, Today</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="input-group">
                                        <div className="input-group-append">
                                            <span className="input-group-text attach_btn"><i
                                                className="fas fa-paperclip"></i></span>
                                        </div>
                                        <textarea name="" className="form-control type_msg"
                                                  placeholder="Type your message..."></textarea>
                                        <div className="input-group-append">
                                            <span className="input-group-text send_btn"><i
                                                className="fas fa-location-arrow"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MDBModal show={basicModal} onHide={() => setBasicModal(false)}>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Create Room</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none" onClick={toggleOpen} />
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput
                                type={"text"}
                                value={roomNames}
                                onChange={(e) => setRoomNames(e.target.value)}
                                label="Room Name"
                            ></MDBInput>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={toggleOpen}>
                                Close
                            </MDBBtn>
                            <MDBBtn onClick={handleCreateRoom} >Create</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}
