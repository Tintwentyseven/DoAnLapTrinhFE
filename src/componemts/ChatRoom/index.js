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
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { useWebSocket } from "../WebSocket/WebSocketContext";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
    const [messages, setMessages] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [roomNames, setRoomNames] = useState('');
    const messagesEndRef = useRef(null);
    const [scrollToBottom, setScrollToBottom] = useState(false); // State để xác định cuộn xuống dưới cùng
    const [userAvatar, setUserAvatar] = useState('https://therichpost.com/wp-content/uploads/2020/06/avatar2.png');
    const [data, setData] = useState([]);

    // Sử dụng useEffect để cuộn xuống dưới cùng khi có tin nhắn mới
    useEffect(() => {
        if (scrollToBottom) {
            const msgCardBody = document.querySelector('.msg_card_body');
            if (msgCardBody) {
                msgCardBody.scrollTop = msgCardBody.scrollHeight;
            }
            setScrollToBottom(false); // Đặt lại trạng thái sau khi cuộn xuống
        }
    }, [messages, scrollToBottom]);

    const [joinRoomCode, setJoinRoomCode] = useState('');
    const [joinRoomModal, setJoinRoomModal] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [darkMode]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.clear();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const handleToggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const fetchUserData = async () => {
        try {
            const db = getFirestore();
            const userRef = collection(db, 'users');
            const snapshot = await getDocs(userRef);
            const allData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setData(allData);
            console.log(allData);

            const userData = allData.find(user => user.username === username);

            if (userData) {
                if (userData.avatar && userData.avatar.length > 0) {
                    setUserAvatar(userData.avatar);
                } else {
                    if (userData.gender === 'male') {
                        setUserAvatar('https://bootdey.com/img/Content/avatar/avatar7.png');
                    } else if (userData.gender === 'female') {
                        setUserAvatar('https://bootdey.com/img/Content/avatar/avatar3.png');
                    }
                }
            } else {
                console.log('No matching user found in Firestore');
            }

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [username]);


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
                localStorage.clear();
                sessionStorage.removeItem('userList');
                setUserList([]);
                setDisplayName('');
                setMessages([]);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Logout successful',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/logout');
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
        } else {
            console.error('WebSocket is not open. Unable to send message.');
            return;
        }

        toggleOpen();
    };

    useEffect(() => {
        const handleCreateRoomResponse = (event) => {
            const response = JSON.parse(event.data);
            if (response.event === "CREATE_ROOM") {
                if (response.status === "success") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: response.status,
                        text: response.message,
                        showConfirmButton: false,
                        timer: 1500
                    });

                    const currentDate = new Date();
                    currentDate.setHours(currentDate.getHours() - 7);
                    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

                    const newUserList = [{
                        name: roomNames,
                        type: 1,
                        actionTime: formattedDate,
                        roomOwner: username
                    }, ...userList];
                    setUserList(newUserList);
                    localStorage.setItem('userList', JSON.stringify(newUserList));

                    // Save room data to localStorage
                    const roomData = {
                        own: username
                    };
                    localStorage.setItem('data', JSON.stringify(roomData));
                } else {
                    Swal.fire({
                        icon: 'warning',
                        text: 'Tên phòng đã tồn tại!',
                    });
                    console.error('Create room error details:', response);
                }
            }
        };

        if (socket) {
            socket.addEventListener('message', handleCreateRoomResponse);
        }

        return () => {
            if (socket) {
                socket.removeEventListener('message', handleCreateRoomResponse);
            }
        };
    }, [socket, userList, roomNames, username]);

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
        const trimmedSearchInput = searchInput.trim();

        if (!isCheckboxChecked) {
            const user = userList.find(user => user.name === trimmedSearchInput && user.type === 0);
            if (user) {
                setDisplayName(user.name);
                setMessageContent('');
                setSearchType('user');
                Swal.fire({
                    text: `User ${user.name} exists.`,
                    icon: 'success',
                });

                // Fetch messages for the user
                fetchMessages('GET_PEOPLE_CHAT_MES', user.name);
            } else {
                Swal.fire({
                    text: `User ${trimmedSearchInput} does not exist.`,
                    icon: 'warning',
                });
            }
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

                    // Fetch messages for the room
                    fetchMessages('GET_ROOM_CHAT_MES', roomName);
                } else {
                    Swal.fire({
                        text: `Room ${searchInput} không tồn tại`,
                        icon: 'warning',
                    });
                }
            };
        }
    };

    const fetchMessages = (event, name) => {
        const requestData = {
            action: "onchat",
            data: {
                event: event,
                data: {
                    name: name,
                    page: 1
                }
            }
        };

        socket.send(JSON.stringify(requestData));

        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.status === "success") {
                const fetchedMessages = event === 'GET_PEOPLE_CHAT_MES' ?
                    response.data?.reverse() || [] :
                    response.data?.chatData?.reverse() || [];
                setMessages(fetchedMessages);
            } else {
                Swal.fire({
                    text: `Failed to fetch messages for ${name}.`,
                    icon: 'error',
                });
            }
        };
    };

    const handleLiClick = (name, type, roomOwner) => {
        setDisplayName(name);
        setMessageContent(type === 0 ? 'Người dùng' : 'Phòng');
        setSearchType(type === 0 ? 'user' : 'room');


        let avatarSrc = 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';
        const matchedUser = data.find(dbUser => dbUser.username === name);
        if (matchedUser) {
            if (matchedUser.avatar && matchedUser.avatar.length > 0) {
                avatarSrc = matchedUser.avatar;
            } else if (matchedUser.gender === 'male') {
                avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar7.png';
            } else if (matchedUser.gender === 'female') {
                avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar3.png';
            }
        }
        setUserAvatar(avatarSrc);



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
                event: type === 0 ? "GET_PEOPLE_CHAT_MES" : "GET_ROOM_CHAT_MES",
                data: {
                    name: name,
                    page: 1
                }
            }
        };

        socket.send(JSON.stringify(requestData));

        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (response.status === "success") {
                let fetchedMessages = [];

                if (type === 0 && Array.isArray(response.data)) {
                    fetchedMessages = response.data.reverse();
                } else if (type === 1 && response.data && Array.isArray(response.data.chatData)) {
                    fetchedMessages = response.data.chatData.reverse();
                }

                setMessages(fetchedMessages);
                setScrollToBottom(true); // Cuộn xuống dưới cùng khi có tin nhắn mới
            } else {
                Swal.fire({
                    text: `Failed to fetch messages for ${name}.`,
                    icon: 'error',
                });
            }
        };
        setScrollToBottom(true); // Đặt trạng thái để cuộn xuống dưới cùng
    };

    const add7Hours = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 7);
        return date;
    };

    const renderDateTime = (dateString) => {
        const date = add7Hours(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    };

    // join room
    const handleJoinRoom = () => {
        const isAlreadyMember = userList.some((room) => room.name === joinRoomCode && room.type === 1);
        if (isAlreadyMember) {
            Swal.fire({
                icon: 'info',
                title: 'Already a member',
                text: 'Bạn đã là thành viên của phòng.',
            });
            return;
        }

        const joinRoomRequest = {
            action: "onchat",
            data: {
                event: "JOIN_ROOM",
                data: {
                    name: joinRoomCode // Thay đổi từ code thành name
                }
            }
        };

        console.log('Sending join room request:', JSON.stringify(joinRoomRequest)); // Log toàn bộ request

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(joinRoomRequest));
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }

        setJoinRoomModal(false); // Đóng modal sau khi gửi yêu cầu tham gia phòng
    };

    useEffect(() => {
        const handleJoinRoomResponse = (event) => {
            const response = JSON.parse(event.data);
            console.log('Received response:', response); // Debug phản hồi nhận được
            if (response.event === "JOIN_ROOM") {
                if (response.status === "success") {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: response.status,
                        text: 'Joined room successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    // Cập nhật danh sách userList và lưu vào localStorage
                    const currentDate = new Date();
                    currentDate.setHours(currentDate.getHours() - 7);
                    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

                    const newUserList = [{
                        name: joinRoomCode,
                        type: 1,
                        actionTime: formattedDate,
                        roomOwner: response.data.roomOwner || 'Unknown'
                    }, ...userList];
                    setUserList(newUserList);
                    localStorage.setItem('userList', JSON.stringify(newUserList));

                    // Xử lý các hành động khác nếu cần
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Join Room Error',
                        text: response.message || 'Failed to join the room',
                    });
                }
            }
        };

        if (socket) {
            socket.addEventListener('message', handleJoinRoomResponse);
        }

        return () => {
            if (socket) {
                socket.removeEventListener('message', handleJoinRoomResponse);
            }
        };
    }, [socket, userList, joinRoomCode]);



// >>>>>>> main


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
                                <div className="card-body contacts_body"
                                     style={{overflowY: 'auto', overflowX: 'auto', maxHeight: '600px'}}>
                                    <ul className="contacts">
                                        {userList.length > 0 ? (
                                            userList.map((user, index) => {
                                                const matchedUser = data.find(dbUser => dbUser.username === user.name);
                                                let avatarSrc = 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';

                                                if (matchedUser) {
                                                    if (matchedUser.avatar && matchedUser.avatar.length > 0) {
                                                        avatarSrc = matchedUser.avatar;
                                                    } else if (matchedUser.gender === 'male') {
                                                        avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar7.png';
                                                    } else if (matchedUser.gender === 'female') {
                                                        avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar3.png';
                                                    }
                                                }

                                                return (
                                                    <li key={index}
                                                        className={user.name === displayName ? 'active' : ''}
                                                        onClick={() => handleLiClick(user.name, user.type, user.roomOwner)}>
                                                        <div className="d-flex bd-highlight">
                                                            <div className="img_cont">
                                                                <img
                                                                    src={avatarSrc}
                                                                    alt="avatar"
                                                                    className="rounded-circle user_img"
                                                                />
                                                                <span className="online_icon"></span>
                                                            </div>
                                                            <div className="user_info">
                                                                <span>{user.name}</span>
                                                                <p className="typechat">Type: {user.type}</p>
                                                                <p>Last Action: {renderDateTime(user.actionTime)}</p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        ) : (
                                            <li>No users found.</li>
                                        )}
                                    </ul>
                                </div>
                                <div className="card-footer"></div>
                            </div>
                        </div>
                        <div className="col-md-8 col-xl-6 chat">
                            <div className="card" id="chatcenter">
                                <div className="card-header msg_head">
                                    <div className="d-flex bd-highlight">
                                        <div className="img_cont">
                                            <img
                                                src={userAvatar}
                                                className="rounded-circle user_img"
                                            />
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
                                                    style={{marginBottom: "3px"}}
                                                >
                                                    <MDBIcon fas icon="plus-circle"/>
                                                </MDBBtn>
                                            </span>
                                        </div>
                                    </div>
                                    <span id="action_menu_btn" onClick={toggleMenu}>
                                        <i className="fas fa-ellipsis-v"></i>
                                    </span>
                                    <div className={`action_menu ${isOpen ? 'open' : ''}`}>
                                        <ul>
                                            <li id="toggle-dark-mode" onClick={handleToggleDarkMode}>
                                                <i className={`fa-regular ${darkMode ? 'fa-sun' : 'fa-moon'}`}
                                                   id="icontype"></i>
                                                <span
                                                    className={`${darkMode ? 'light' : 'dark'}`}>{darkMode ? 'Light mode' : 'Dark mode'}</span>
                                            </li>
                                            <li><i className="fas fa-user-circle"></i> View profile</li>
                                            {/*<li><i className="fas fa-plus"></i> Join room</li>*/}
                                            <li onClick={() => setJoinRoomModal(true)}>
                                                <i className="fas fa-plus"></i> Join room
                                            </li>
                                            <li id="logout-button" onClick={handleLogout}><i
                                                className="fas fa-ban"></i> Logout
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-body msg_card_body"
                                     ref={messagesEndRef}
                                     style={{overflowY: 'auto', overflowX: 'auto', maxHeight: '600px'}}>
                                    {messages.map((message, index) => {
                                        const matchedUser = data.find(dbUser => dbUser.username === message.name);
                                        let avatarSrc = 'https://therichpost.com/wp-content/uploads/2020/06/avatar2.png';

                                        if (matchedUser) {
                                            if (matchedUser.avatar && matchedUser.avatar.length > 0) {
                                                avatarSrc = matchedUser.avatar;
                                            } else if (matchedUser.gender === 'male') {
                                                avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar7.png';
                                            } else if (matchedUser.gender === 'female') {
                                                avatarSrc = 'https://bootdey.com/img/Content/avatar/avatar3.png';
                                            }
                                        }

                                        return (
                                            <div key={index}
                                                 className={`d-flex mb-4 ${message.name === username ? 'justify-content-end' : 'justify-content-start'}`}>
                                                {searchType === 'room' && message.name !== username && (
                                                    <span className="sender">{message.name} </span>
                                                )}
                                                <div className="img_cont_msg">
                                                    <img
                                                        src={avatarSrc}
                                                        alt="avatar"
                                                        className="rounded-circle user_img_msg"
                                                    />
                                                </div>
                                                <div
                                                    className={`msg_cotainer${message.name === username ? '_send' : ''}`}>
                                                    <div className="message-content">
                                                        {message.mes}
                                                        <span
                                                            className={`msg_time${message.name === username ? '_send' : ''}`}>
                            {renderDateTime(message.createAt)}
                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef}></div>
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
                            <MDBBtn className="btn-close" color="none" onClick={toggleOpen}/>
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
                            <MDBBtn onClick={handleCreateRoom}>Create</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>

            {/* Modal Join Room */}
            <MDBModal show={joinRoomModal} onHide={() => setJoinRoomModal(false)}>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Join Room</MDBModalTitle>
                            <MDBBtn className="btn-close" color="none" onClick={() => setJoinRoomModal(false)}/>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <MDBInput
                                type="text"
                                value={joinRoomCode}
                                onChange={(e) => setJoinRoomCode(e.target.value)}
                                label="Room Code"
                            />
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn color="secondary" onClick={() => setJoinRoomModal(false)}>
                                Close
                            </MDBBtn>
                            <MDBBtn onClick={handleJoinRoom}>
                                Join
                            </MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}
