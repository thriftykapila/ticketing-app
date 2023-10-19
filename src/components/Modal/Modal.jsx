import React from "react";
import "./modal.css";
const Modal = ({ showModal, setShowModal, setMessage, children }) => {
  return showModal ? (
    <div className="modal">
      <div className="modal-content">
        <span
          className="close-button"
          onClick={() => {
            setShowModal(false);
            setMessage("");
          }}
        >
          &times;
        </span>
        <div className="children">{children}</div>
      </div>
    </div>
  ) : null;
};

export default Modal;
