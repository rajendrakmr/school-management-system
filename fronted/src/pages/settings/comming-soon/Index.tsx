import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slice/bredCrumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

const Index: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadcrumbs(["Coming Soon"]));
  }, [dispatch]);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "80vh", textAlign: "center", color: "#555" }}
    >
      <FontAwesomeIcon icon={faClock} size="4x" className="mb-3" />
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Coming Soon</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "400px" }}>
        This feature is under development and will be available soon. Stay tuned!
      </p>
    </div>
  );
};

export default Index;
