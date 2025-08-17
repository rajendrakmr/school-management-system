import React from "react";

const AppFooter: React.FC = () => {
    return <footer className="footer d-flex flex-column flex-md-row align-items-center justify-content-between px-4 py-3 border-top small">
        <p className="text-muted mb-1 mb-md-0">
            Copyright © 2025{" "}
            <a href="http://hicloud.co.in/" target="_blank">
                hicloud.co.in
            </a> 
            .
        </p>
    </footer>;
};

export default AppFooter;
