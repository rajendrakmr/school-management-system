import React from "react";
import "./ToggleSwitch.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleCustomSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <div className="toggle-switch" onClick={onChange}>
      <div className={`switch-handle ${checked ? "checked" : ""}`} />
    </div>
  );
};

export default ToggleCustomSwitch;
