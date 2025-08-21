import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const DashboardHeader: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<string>("");
    const usersInfo = useSelector((state: RootState) => state.user.user || {});
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formatted = now.toLocaleString("en-IN", {
                weekday: "long", // Monday
                year: "numeric",
                month: "long", // January
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            setCurrentTime(formatted);
        }; 
        updateTime(); // first run
        const interval = setInterval(updateTime, 1000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="shadow-lg p-3 d-flex justify-content-between align-items-center grid-margin ">
            {/* <h4>Welcome to ERP SaaS : School Management System</h4> */}
            <h6 className="dashboard-title">Welcome back, {usersInfo?.first_name} 👋</h6>
            <br />
            <p className="dashboard-subtitle"><strong>{currentTime}</strong></p>

        </div>
    );
};

export default DashboardHeader;
