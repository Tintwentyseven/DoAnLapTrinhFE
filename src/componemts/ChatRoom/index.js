import React, { useState, useEffect } from "react";
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

export default function ChatRoom() {
    const [basicModal, setBasicModal] = useState(false);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const socket = useWebSocket();

    const sessionData = JSON.parse(localStorage.getItem('sessionData')) || {};
// // <<<<<<< HEAD
//     // console.log("session1: "+ sessionData);
//     const { username, code ,userList:initialUserList} =  sessionData;
//     // console.log("user cua m do: "+userList);
//
//     console.log("user: " + username);
// =======chu y
    const {username, code} = sessionData;
    const initialUserList = JSON.parse(localStorage.getItem('userList')) || [];
// >>>>>>> main

    const toggleOpen = () => setBasicModal(!basicModal);
    const toggleMenu = () => setIsOpen(!isOpen);

    const [searchInput, setSearchInput] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [userList, setUserList] = useState(initialUserList);
    const [roomOwner, setRoomOwner] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [displayName, setDisplayName] = useState(username);
    const [searchType, setSearchType] = useState('');
    const [messages, setMessages] = useState([]); // New state variable for messages

    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const handleToggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

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
                    }, {once: true});
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
                setDisplayName(''); // Clear display name
                setMessages([]); // Clear messages
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

// <<<<<<< HEAD

    //==========================create room======================

    const [roomNames, setRoomNames] = useState('');
    // const handleCreateRoom = () => {
    //     const createRoom = {
    //         action: "onchat",
    //         data: {
    //             event: "CREATE_ROOM",
    //             data: {
    //                 name: roomNames
    //             }
    //         }
    //     };
    //
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         socket.send(JSON.stringify(createRoom));
    //         console.log('Room creation message sent');
    //     } else {
    //         console.error('WebSocket is not open. Unable to send message.');
    //     }
    //
    //     toggleOpen(); // Đóng modal sau khi gửi yêu cầu tạo phòng
    // };
    // useEffect(() => {
    //     const handleCreateRoomResponse = (event) => {
    //         console.log("da vo create room thong bao...")
    //         const response = JSON.parse(event.data);
    //         if (response.event === "CREATE_ROOM") {
    //             if (response.status === "success") {
    //                 // Hiển thị thông báo thành công
    //                 Swal.fire({
    //                     position: 'center',
    //                     icon: 'success',
    //                     title: response.status,
    //                     text: response.message,
    //                     showConfirmButton: false,
    //                     timer: 1500
    //                 });
    //                 // Xử lý các hành động khác nếu cần
    //             } else {
    //                 // Hiển thị thông báo lỗi
    //                 Swal.fire({
    //                     icon: 'warning',
    //                     // title: response.status,
    //                     text: 'Tên phòng đã tồn tại!',
    //                 });
    //                 console.error('Create room error details:', response);
    //             }
    //         }
    //     };
    //
    //     // Thêm sự kiện lắng nghe cho WebSocket
    //     if (socket) {
    //         socket.addEventListener('message', handleCreateRoomResponse);
    //     }
    //
    //     // Cleanup function
    //     return () => {
    //         // Xóa sự kiện lắng nghe khi component unmount
    //         if (socket) {
    //             socket.removeEventListener('message', handleCreateRoomResponse);
    //         }
    //     };
    // }, [socket]);
    //sua create
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
            console.log("Đã vào hàm xử lý tạo phòng...");
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
                    console.error('Chi tiết lỗi tạo phòng:', response);
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
//     chuc nang search
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

                        // Fetch messages for the user
                        fetchMessages('GET_PEOPLE_CHAT_MES', searchInput.trim());
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
    //================sua hàm search
    // const handleSearchInputChange = (event) => {
    //     setSearchInput(event.target.value);
    // };
    //
    // const handleCheckboxChange = (event) => {
    //     setIsCheckboxChecked(event.target.checked);
    // };
    //
    // const handleSearch = () => {
    //     // Kiểm tra WebSocket có sẵn và đang mở không
    //     if (!socket || socket.readyState !== WebSocket.OPEN) {
    //         console.error('WebSocket connection is not open');
    //         // Hiển thị thông báo lỗi nếu WebSocket không sẵn sàng
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'WebSocket Error',
    //             text: 'Unable to establish WebSocket connection',
    //         });
    //         return;
    //     }
    //
    //     // Tạo requestData dựa trên trạng thái của isCheckboxChecked
    //     const requestData = isCheckboxChecked
    //         ? {
    //             action: "onchat",
    //             data: {
    //                 event: "GET_ROOM_CHAT_MES",
    //                 data: {
    //                     name: searchInput.trim(),
    //                     page: 1
    //                 }
    //             }
    //         }
    //         : {
    //             action: "onchat",
    //             data: {
    //                 event: "CHECK_USER",
    //                 data: {
    //                     user: searchInput.trim()
    //                 }
    //             }
    //         };
    //
    //     // Gửi requestData qua WebSocket
    //     socket.send(JSON.stringify(requestData));
    // };
    //
    // useEffect(() => {
    //     // Hàm xử lý message từ WebSocket
    //     const handleMessage = (event) => {
    //         // Parse dữ liệu nhận được từ event
    //         const response = JSON.parse(event.data);
    //
    //         // Xử lý dựa trên event nhận được từ server
    //         if (response.event === "CHECK_USER") {
    //             // Xử lý response khi kiểm tra người dùng
    //             if (response.status === "success") {
    //                 if (response.data.status) {
    //                     // Nếu người dùng đã từng đăng nhập, set state và hiển thị thông báo
    //                     setDisplayName(searchInput.trim());
    //                     setMessageContent('');
    //                     setSearchType('user');
    //                     Swal.fire({
    //                         text: `User ${searchInput} has logged in before.`,
    //                         icon: 'success',
    //                     });
    //
    //                     // Fetch messages cho người dùng
    //                     fetchMessages('GET_PEOPLE_CHAT_MES', searchInput.trim());
    //                 } else {
    //                     // Nếu người dùng chưa từng đăng nhập, hiển thị thông báo cảnh báo
    //                     Swal.fire({
    //                         text: `User ${searchInput} has not logged in before.`,
    //                         icon: 'warning',
    //                     });
    //                 }
    //             } else {
    //                 // Xử lý khi kiểm tra người dùng thất bại
    //                 Swal.fire({
    //                     text: `Failed to check user ${searchInput}.`,
    //                     icon: 'error',
    //                 });
    //             }
    //         } else if (response.event === "GET_ROOM_CHAT_MES") {
    //             // Xử lý response khi lấy tin nhắn của phòng chat
    //             if (response.status === "success") {
    //                 const roomData = response.data;
    //                 const roomName = roomData.name;
    //
    //                 // Lưu roomData vào localStorage
    //                 localStorage.setItem('data', JSON.stringify(roomData));
    //
    //                 // Lấy danh sách user từ localStorage
    //                 const savedUserList = JSON.parse(localStorage.getItem('userList')) || [];
    //                 // Kiểm tra nếu phòng chưa tồn tại trong danh sách, thêm mới
    //                 const existingRoom = savedUserList.find(room => room.name === roomName);
    //                 if (!existingRoom) {
    //                     savedUserList.push(roomData);
    //                     localStorage.setItem('userList', JSON.stringify(savedUserList));
    //                 }
    //
    //                 // Set state với thông tin phòng
    //                 setRoomOwner(roomData.own);
    //                 setMessageContent(username === roomData.own ? 'Người tạo phòng' : 'Người tham gia');
    //                 setDisplayName(roomName);
    //                 setSearchType('room');
    //
    //                 // Hiển thị thông báo thành công
    //                 Swal.fire({
    //                     text: `Room ${roomName} tồn tại`,
    //                     icon: 'success',
    //                 });
    //
    //                 // Fetch messages cho phòng chat
    //                 fetchMessages('GET_ROOM_CHAT_MES', roomName);
    //             } else {
    //                 // Xử lý khi lấy tin nhắn phòng chat thất bại
    //                 Swal.fire({
    //                     text: `Room ${searchInput} không tồn tại`,
    //                     icon: 'warning',
    //                 });
    //             }
    //         }
    //     };
    //
    //     // Thêm listener để lắng nghe message từ WebSocket, chỉ thêm một lần
    //     if (socket) {
    //         socket.addEventListener('message', handleMessage);
    //     }
    //
    //     // Cleanup function để loại bỏ listener khi component unmount hoặc dependencies thay đổi
    //     return () => {
    //         if (socket) {
    //             socket.removeEventListener('message', handleMessage);
    //         }
    //     };
    // }, [socket, searchInput, isCheckboxChecked]);



// // ====================end

// <<<<<<< HEAD
//
//
// =======
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
    //sua hàm fect
    // const fetchMessages = (event, name) => {
    //     const requestData = {
    //         action: "onchat",
    //         data: {
    //             event: event,
    //             data: {
    //                 name: name,
    //                 page: 1
    //             }
    //         }
    //     };
    //
    //     const handleMessage = (event) => {
    //         const response = JSON.parse(event.data);
    //         if (response.event === event) {
    //             if (response.status === "success") {
    //                 const fetchedMessages = event === 'GET_PEOPLE_CHAT_MES' ?
    //                     response.data?.reverse() || [] :
    //                     response.data?.chatData?.reverse() || [];
    //                 setMessages(fetchedMessages);
    //             } else {
    //                 Swal.fire({
    //                     text: `Failed to fetch messages for ${name}.`,
    //                     icon: 'error',
    //                 });
    //             }
    //             // Remove the event listener once the response is received
    //             socket.removeEventListener('message', handleMessage);
    //         }
    //     };
    //
    //     if (socket && socket.readyState === WebSocket.OPEN) {
    //         socket.send(JSON.stringify(requestData));
    //         socket.addEventListener('message', handleMessage);
    //     } else {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'WebSocket Error',
    //             text: 'Unable to establish WebSocket connection',
    //         });
    //     }
    // };

//     // ================end fect

    const handleLiClick = (name, type, roomOwner) => {
        setDisplayName(name);
        setMessageContent(type === 0 ? 'Người dùng' : 'Phòng');
        setSearchType(type === 0 ? 'user' : 'room');

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
            } else {
                Swal.fire({
                    text: `Failed to fetch messages for ${name}.`,
                    icon: 'error',
                });
            }
        };
    };

    // //sua click
    // const handleLiClick = (name, type, roomOwner) => {
    //     setDisplayName(name);
    //     setMessageContent(type === 0 ? 'Người dùng' : 'Phòng');
    //     setSearchType(type === 0 ? 'user' : 'room');
    //
    //     if (!socket || socket.readyState !== WebSocket.OPEN) {
    //         console.error('WebSocket connection is not open');
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'WebSocket Error',
    //             text: 'Unable to establish WebSocket connection',
    //         });
    //         return;
    //     }
    //
    //     const requestData = {
    //         action: "onchat",
    //         data: {
    //             event: type === 0 ? "GET_PEOPLE_CHAT_MES" : "GET_ROOM_CHAT_MES",
    //             data: {
    //                 name: name,
    //                 page: 1
    //             }
    //         }
    //     };
    //
    //     const handleMessage = (event) => {
    //         const response = JSON.parse(event.data);
    //         if (response.status === "success") {
    //             let fetchedMessages = [];
    //
    //             if (type === 0 && Array.isArray(response.data)) {
    //                 fetchedMessages = response.data.reverse();
    //             } else if (type === 1 && response.data && Array.isArray(response.data.chatData)) {
    //                 fetchedMessages = response.data.chatData.reverse();
    //             }
    //
    //             setMessages(fetchedMessages);
    //         } else {
    //             Swal.fire({
    //                 text: `Failed to fetch messages for ${name}.`,
    //                 icon: 'error',
    //             });
    //         }
    //
    //         // Remove the event listener once the response is received
    //         socket.removeEventListener('message', handleMessage);
    //     };
    //
    //     socket.send(JSON.stringify(requestData));
    //     socket.addEventListener('message', handleMessage);
    // };
//========================endclick

    // Helper function to add 7 hours to a date
    const add7Hours = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours() + 7);
        return date;
    };

    // Function to render formatted date and time
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
                                            userList.map((user, index) => (
                                                <li key={index}
                                                    className={user.name === displayName ? 'active' : ''}
                                                    onClick={() => handleLiClick(user.name, user.type, user.roomOwner)}>
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
                                                            <p className="typechat">Type: {user.type}</p>
                                                            <p>Last Action: {renderDateTime(user.actionTime)}</p>
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
                            <div className="card" id="chatcenter">
                                <div className="card-header msg_head">
                                    <div className="d-flex bd-highlight">
                                        <div className="img_cont">
                                            <img
                                                src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                className="rounded-circle user_img"/>
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
                                            <li><i className="fas fa-plus"></i> Join room</li>
                                            <li id="logout-button" onClick={handleLogout}><i
                                                className="fas fa-ban"></i> Logout
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-body msg_card_body"
                                     style={{overflowY: 'auto', overflowX: 'auto', maxHeight: '600px'}}>
                                    {messages.map((message, index) => (
                                        <div key={index}
                                             className={`d-flex mb-4 ${message.name === username ? 'justify-content-end' : 'justify-content-start'}`}>
                                            {searchType === 'room' && message.name !== username && (
                                                <span className="sender">{message.name} </span>
                                            )}
                                            <div className="img_cont_msg">
                                                <img

                                                    src="https://therichpost.com/wp-content/uploads/2020/06/avatar2.png"
                                                    className="rounded-circle user_img_msg"/>
                                            </div>
                                            <div
                                                className={`msg_cotainer${message.name === username ? '_send' : ''}`}>
                                                <div className="message-content">
                                                    {message.mes}
                                                    <span
                                                        className={`msg_time${message.name === username ? '_send' : ''}`}>{renderDateTime(message.createAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                            <MDBBtn onClick={handleCreateRoom} >Create</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}

