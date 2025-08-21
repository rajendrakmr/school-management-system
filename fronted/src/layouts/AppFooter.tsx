import React from "react";

const AppFooter: React.FC = () => {
    return (
        <footer className="footer bg-light border-top py-3 px-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
            <p className="text-muted mb-2 mb-md-0 small">
                &copy; 2025{" "}
                <a
                    href="http://hicloud.co.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none text-primary"
                >
                    hicloud.co.in
                </a>
                . All rights reserved.
            </p>

            <div className="d-flex gap-3">
                <a
                    href="https://www.facebook.com/hicloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted small"
                >
                    Facebook
                </a>
                <a
                    href="https://twitter.com/hicloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted small"
                >
                    Twitter
                </a>
                <a
                    href="https://www.linkedin.com/company/hicloud"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted small"
                >
                    LinkedIn
                </a>
            </div>
        </footer>
    );
};

export default AppFooter;
