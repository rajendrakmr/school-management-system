import React from "react";
import { motion } from "framer-motion";
import "./SliderForm.css";

interface SettingsModalProps {
  show: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  isSubmitting?: boolean;
  errors?: any; // made optional
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // made optional
}

const SliderForm: React.FC<SettingsModalProps> = ({
  show,
  title,
  onClose,
  onSubmit,
  children,
  isSubmitting,
}) => {
  return (
    <>
      {show && <div className="modal-overlay" onClick={onClose}></div>}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: show ? "0%" : "100%" }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="form-modal"
      >
        <div className="form-modal" style={{ backgroundColor: "#fff" }}>
          {/* Header */}
          <div className="modalheader d-flex justify-content-end">
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div
            className="px-4 mx-auto d-flex justify-content-between align-items-center w-100 fw-bold"
            style={{ backgroundColor: "#fff" }}
          >
            <span>{title}</span>
            <span className="text-danger mandatorField">
              (*) Indicates Mandatory Fields.
            </span>
          </div>

          {/* Body */}
          <div
            className="m-2 px-4 shadow-lg p-2 pb-5"
            style={{ margin: "2px auto", backgroundColor: "#fff" }}
          >
            {children}
          </div>

          {/* Footer */}
          <div className="modal-footer p-2">
            <button
              type="button"
              className="btn-sm btn btn-danger mx-2"
              onClick={onClose}
              data-bs-dismiss="modal"
              style={{borderRadius:"0px"}}
            >
              Back
            </button>
            <button
            style={{borderRadius:"0px"}}
              className="btn-sm btn btn-primary submit_button mx-2"
              onClick={onSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SliderForm;
