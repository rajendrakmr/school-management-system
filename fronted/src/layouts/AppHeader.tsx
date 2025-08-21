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
    faUserCircle,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import BredCrumbs from "./BredCrumbs";
import { useDispatch } from "react-redux";
import { useAuthLogoutMutation } from "@/store/slice/auth";
import { clearUserData } from "@/store/slice/userInfo";

interface HeaderProps<T = any> {
    toggleSidebar?: () => void;
    setIsToggle: React.Dispatch<React.SetStateAction<T>>;
    isToggle: boolean;
}

const AppHeader: React.FC<HeaderProps> = ({ setIsToggle, isToggle }) => {

    const dispatch = useDispatch();
    const [authLogout] = useAuthLogoutMutation();

    const handleLogout = async () => {
        try {
            await authLogout().unwrap(); // call logout API
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            dispatch(clearUserData()); // clear Redux user/menu
            localStorage.clear(); // clear persisted storage
            sessionStorage.clear();
            window.location.href = "/apps/login"; // redirect to login
        }
    };
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
                <BredCrumbs />
            </div>

            {/* Right Section: Notifications, Theme, Language, and Profile */}
            <div className="d-flex align-items-center">
                <div className="notification-icon me-3" style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faBell} size="lg" className="text-success" />
                </div>

                <div className="theme-toggle me-3" onClick={toggleTheme}>
                    <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} size="lg" className="text-primary" />
                </div>
                <div className="notification me-3" onClick={handleNotificationClick} style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} size="lg" className="text-primary" />
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
                        <Dropdown.Item onClick={handleProfileClick}>
                            <FontAwesomeIcon icon={faUserCircle} className="me-2 text-primary" />
                            Profile
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout}>
                            <FontAwesomeIcon icon={faRightFromBracket} className="me-2 text-danger" />
                            Logout
                        </Dropdown.Item>
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

export default AppHeader;
