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
import { useNavigate, Link } from 'react-router-dom';
import Swal from "sweetalert2";
import { useWebSocket } from "../WebSocket/WebSocketContext";

export default function ChatRoom() {
    const [basicModal, setBasicModal] = useState(false);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const socket = useWebSocket();

    const sessionData = JSON.parse(localStorage.getItem('sessionData')) || {};
    const { username, code } = sessionData;
    const initialUserList = JSON.parse(localStorage.getItem('userList')) || [];

    const toggleOpen = () => setBasicModal(!basicModal);
    const toggleMenu = () => setIsOpen(!isOpen);

    const [searchInput, setSearchInput] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [userList, setUserList] = useState(initialUserList);
    const [roomOwner, setRoomOwner] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [displayName, setDisplayName] = useState(username);
    const [searchType, setSearchType] = useState('');

    useEffect(() => {
        if (!socket) return;

        const handleReload = () => {
            if (username && code) {
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
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: response.status,
                        text: response.mes,
                    });
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

        const handleLogoutMessage = (event) => {
            const response = JSON.parse(event.data);

            if (response.status === "success") {
                localStorage.removeItem('sessionData');
                localStorage.removeItem('userList');
                localStorage.removeItem('data');
                sessionStorage.removeItem('userList');
                setUserList([]);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Logout successful',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/logout'); // Navigate to logout page after successful logout
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: response.status,
                    text: response.mes,
                });
            }

            socket.removeEventListener('message', handleLogoutMessage);
        };

        socket.addEventListener('message', handleLogoutMessage);
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

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
                if (response.status === "success") {
                    if (response.data.status) {
                        setDisplayName(searchInput.trim());
                        setMessageContent('');
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
                if (response.status === "success") {
                    const roomData = response.data;
                    const roomName = roomData.name;

                    localStorage.setItem('data', JSON.stringify(roomData));

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
                                        <MDBInput
                                            type="text"
                                            placeholder="Search..."
                                            name="searchInput"
                                            className="form-control search"
                                            value={searchInput}
                                            onChange={handleSearchInputChange}
                                            list="datalistOptions"
                                        />
                                        <datalist id="datalistOptions">
                                            {userList
                                                .filter(user => !isCheckboxChecked ? user.type === 0 : user.type === 1)
                                                .map((user, index) => (
                                                    <option key={index} value={user.name}/>
                                                ))
                                            }
                                        </datalist>

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
                            <MDBInput type={"text"}></MDBInput>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={toggleOpen}>
                                Close
                            </MDBBtn>
                            <MDBBtn>Create</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}
