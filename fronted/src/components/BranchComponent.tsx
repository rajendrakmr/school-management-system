import React, { useCallback } from "react";

interface BranchComponentProps {
  name: string;
  email: string;
  imageSrc?: string;
}

const BranchComponent: React.FC<BranchComponentProps> = ({ name, email, imageSrc }) => {
  const renderImage = useCallback(
    (src?: string) => (
      <img
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          border: "1px solid #ccc",
          objectFit: "cover",
        }}
        src={
          src
            ? `${process.env.BACKEND_PATH_API_URL}/uploads${src}`
            : "https://via.placeholder.com/90?text=No+Logo"
        }
        alt="Logo"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/90?text=No+Logo";
        }}
      />
    ),
    []
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "12px",
      }}
    > 
      {renderImage(imageSrc)}

      {/* Name above email */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 600, fontSize: "16px" }}>{name}</span>
        <span style={{ fontSize: "14px", color: "#666" }}>{email}</span>
      </div>
    </div>
  );
};

export default BranchComponent;
