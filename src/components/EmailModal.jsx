import React, { useEffect, useState } from "react";
import Modal from "./Modal/Modal";
import "./emailModal.css";
import ToastBar from "./Toast";

const EmailModal = ({ showModal, setShowModal }) => {
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const emailData =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.";

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = email;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    displayToast("Email Copied to Clipboard.");
    setTimeout(() => {
      setShowModal(false);
    }, 3500);
  };

  useEffect(() => {
    let currentIndex = 0;
    setEmail(emailData[0]);
    const timer = setInterval(() => {
      currentIndex++;
      if (currentIndex < emailData.length) {
        setEmail((prevEmail) => prevEmail + emailData[currentIndex]);
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <ToastBar message={toastMessage} show={showToast} />
      <Modal showModal={showModal} setShowModal={setShowModal}>
        <div className="container">
          <div className="header">Generating Email</div>
          <textarea
            style={{ resize: "none" }}
            className="email"
            value={email}
            maxLength={300}
            disabled
          />
          <button
            disabled={email.length !== emailData.length}
            onClick={copyToClipboard}
            className={
              email.length === emailData.length ? "copy" : "generating"
            }
          >
            {email.length === emailData.length
              ? toastMessage.length > 0
                ? "Copied"
                : "Copy"
              : "Generating"}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EmailModal;
