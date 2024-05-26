import React from 'react';
import './logoutStyle.css';
import {Link} from 'react-router-dom';
// import './logoutScript'


const Logout = () => {
    return (
        <div id="body">
            <div className="logout-container">
                <div className="logout-card">
                    <img
                        alt="Logout Icon"
                        className="logout-icon"
                        src="https://cdn-icons-png.flaticon.com/512/14571/14571433.png"
                    />
                    <h1 className="text-logout">
                        Bạn đã đăng xuất
                    </h1>
                    <p className="text-thank" >
                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
                    </p>
                    <button id="login-again-btn" >

                        <Link to="/Login" className="link" >Đăng nhập</Link>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Logout;