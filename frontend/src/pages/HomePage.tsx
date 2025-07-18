import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
    return (
        <div className="homepage">
            <header>
                <nav>
                    <div className="logo-container">
                        <img
                            src="https://ik.imagekit.io/foj1ksa7i3/medvendo%20(8).png"
                            alt="Medvendo Logo"
                            className="header-logo"
                        />
                        <span className="company-name-header">Medvendo</span>
                    </div>
                </nav>
            </header>
            <main className="homepage-content">
                <img
                    src="https://ik.imagekit.io/foj1ksa7i3/medvendo%20(8).png"
                    alt="Medvendo Logo"
                    className="main-logo"
                />
                <p className="tagline">MAKING HEALTHCARE BETTER TOGETHER</p>
                <div className="auth-links">
                    <Link to="/login">Login</Link> / <Link to="/signup">Sign Up</Link>
                </div>
            </main>

            <section id="about-us-section" className="about-us-container">
                <p>
                    Welcome to Artsy Technologies Pvt Ltd, where we specialize in Business
                    Automation, Training & Internship Programs, and cutting-edge Digital
                    Marketing Services. Our mission is to leverage technology to foster
                    growth and drive success for businesses through innovative solutions
                    like Chatbots, Analytics, and comprehensive training courses.
                </p>
                <div className="about-us-images">
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/man-robot-working-together-high-tech-office_23-2151966702.jpg_semt=ais_hybrid&w=740"
                        alt="Automation Solutions"
                        loading="lazy"
                    />
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/1729953162129_e=2147483647&v=beta&t=RPKsap9FuEFhGqdnEriQJ7Yqjk4-zkwTNsQgx61MsIoQ"
                        alt="Training Programs"
                        loading="lazy"
                    />
                    <img
                        src="https://ik.imagekit.io/foj1ksa7i3/Digital-Marketing.png_itok=EllAJQXD"
                        alt="Digital Marketing"
                        loading="lazy"
                    />
                </div>
                <p>
                    At Artsy Technologies, we are committed to excellence and continuous
                    learning. Our team of dedicated professionals employs state-of-the-art
                    technologies to develop seamless solutions that push the boundaries of
                    innovation. By joining us, you are not just partnering with an agency;
                    you are embarking on a journey to a more connected future.
                </p>
                <p>
                    We pride ourselves on providing exceptional service and unmatched
                    support to our clients. With extensive expertise and experience, we
                    tackle even the most complex technology challenges, ensuring that our
                    clients are well-equipped to thrive in today's dynamic digital
                    environment.
                </p>
                <blockquote className="philosophy">
                    <p>
                        "Technology, like art, is a soaring exercise of the human
                        imagination."
                    </p>
                </blockquote>
                <div className="connect-with-us">
                    <h3>Connect with Us:</h3>
                    <ul>
                        <li>Phone: 6363787944</li>
                        <li>Email: info@artsytech.in</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
