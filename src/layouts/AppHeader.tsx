import React, { useEffect, useState } from "react";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faBell,
    faUser,
    faMoon,
    faSun,
    faGlobe,
    faExpand,
    faCompress,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

interface HeaderProps<T = any> {
    toggleSidebar?: () => void;
    setIsToggle: React.Dispatch<React.SetStateAction<T>>;
    isToggle: boolean;
}

const Header: React.FC<HeaderProps> = ({ setIsToggle, isToggle }) => {
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [language, setLanguage] = useState("en");

    const handleProfileClick = () => setShowProfileModal(true);
    const handleCloseProfileModal = () => setShowProfileModal(false);
    // const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle('dark-mode', !isDarkMode);
    };
    const changeLanguage = (lang: string) => setLanguage(lang);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const handleNotificationClick = async () => {
        try {
            if (document.fullscreenElement) {
                // If already in fullscreen, exit fullscreen
                await document.exitFullscreen();
                setIsFullscreen(false);
            } else {
                // If not in fullscreen, enter fullscreen
                const docElem = document.documentElement as HTMLElement & {
                    mozRequestFullScreen?: () => Promise<void>;
                    webkitRequestFullscreen?: () => Promise<void>;
                    msRequestFullscreen?: () => Promise<void>;
                };

                if (docElem.requestFullscreen) {
                    await docElem.requestFullscreen();
                } else if (docElem.mozRequestFullScreen) {
                    await docElem.mozRequestFullScreen();
                } else if (docElem.webkitRequestFullscreen) {
                    await docElem.webkitRequestFullscreen();
                } else if (docElem.msRequestFullscreen) {
                    await docElem.msRequestFullscreen();
                }
                setIsFullscreen(true);
            }
        } catch (error) {
            console.error("Fullscreen toggle failed", error);
        }
    };

    useEffect(() => {
        // Apply or remove the 'dark-mode' class on body and sidebar based on isDarkMode state
        document.body.classList.toggle('dark-mode', isDarkMode);
        const sidebar = document.querySelector('.rk_sidebar');
        if (sidebar) {
            sidebar.classList.toggle('dark-mode', isDarkMode);
        }
        // Save the current mode to localStorage
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);


    return (
        <div className={`header-container d-flex justify-content-between align-items-center p-3 sticky-header ${isToggle ? "headerToggleContainer" : ""}`}>
            {/* Left Section: Sidebar Toggle + Breadcrumbs */}
            <div className="d-flex align-items-center">
                <button className="sidebar-toggle btn btn-light me-2" onClick={() => setIsToggle(!isToggle)}>
                    <FontAwesomeIcon icon={faBars} size="lg" />
                </button>
                <div className="breadcrumbs d-flex align-items-center ms-1">
                    <span className="breadcrumb-item">Dashboard | School Details</span>
                </div>
            </div>

            {/* Right Section: Notifications, Theme, Language, and Profile */}
            <div className="d-flex align-items-center">
                <div className="notification-icon me-3"   style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faBell} size="lg" className="text-success" /> 
                </div>

                <div className="theme-toggle me-3" onClick={toggleTheme}>
                    <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} size="lg" className="text-primary"  />
                </div>
                <div className="notification me-3" onClick={handleNotificationClick} style={{ cursor: "pointer" }}> 
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} size="lg" className="text-primary"  />
                </div>

                <Dropdown align="end" className="me-3">
                    <Dropdown.Toggle variant="secondary" id="dropdown-language">
                        <FontAwesomeIcon icon={faGlobe} size="lg" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => changeLanguage("en")}>English</Dropdown.Item>
                        <Dropdown.Item onClick={() => changeLanguage("es")}>Español</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown align="end">
                    <Dropdown.Toggle id="dropdown-profile" className="profile-dropdown-toggle">
                        <FontAwesomeIcon icon={faUser} size="lg" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
                        <Dropdown.Item onClick={() => console.log("Logout clicked")}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Profile Modal */}
            <Modal show={showProfileModal} onHide={handleCloseProfileModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>User profile details...</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseProfileModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Header;
