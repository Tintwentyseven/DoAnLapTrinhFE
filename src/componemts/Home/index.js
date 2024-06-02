import React, { useEffect } from 'react';
import gsap from 'gsap';
import './style.css';
import {Link} from 'react-router-dom';

const Home = () => {
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { duration: 0.75, ease: "power3.inOut" } });

        // Fade in container (Action 1)
        tl.fromTo(
            ".container",
            { scale: 0.2 },
            { scale: 1, duration: 2.5, ease: "elastic" }
        );

        // Text Animate (Action 2)
        tl.fromTo(".text", { x: 500, opacity: 0 }, { x: 0, opacity: 1 }, "<.5");

        // Rotate Cookie (Action 3)
        tl.fromTo(
            ".cookie",
            { rotation: 180, x: -150, opacity: 0 },
            { rotation: 360, x: 0, duration: 0.75, opacity: 1 },
            "<"
        );

        // Cookie Jump (Action 4)
        tl.fromTo(".cookie", { y: 0 }, { y: -25, ease: "elastic" }, "<1");
    }, []);

    return (
        <div className="container">
            <div className="cookie">
                <svg
                    fill="none"
                    height="4.9em"
                    viewBox="0 0 405 395"
                    width="5em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="202.5" cy="197.5" r="197.5" fill="#FAD02E"/>
                    <circle cx="133" cy="146" r="19" fill="#3E2723"/>
                    <circle cx="273" cy="106" r="15" fill="#3E2723"/>
                    <circle cx="130" cy="246" r="13" fill="#3E2723"/>
                    <circle cx="293" cy="263" r="18" fill="#3E2723"/>
                </svg>
            </div>
            <div className="text">
                <h2>Welcome Cookie Chat</h2>
                <p>
                    Chào mừng bạn đã đến với web chat của{' '}
                    <b>Cookie</b>, hi vọng bạn sẽ có được những trải nghiệm tuyệt vời khi sử dụng web chat của chúng tôi.
                </p>
                <div className="btn">
                    <a className="button" href="#">
                        <Link to="/login">Đăng nhập</Link>
                    </a>
                    <a className="button" href="#">
                        <Link to="/register">Đăng kí</Link>

                    </a>
                </div>
            </div>
        </div>
    );
};

export default Home;