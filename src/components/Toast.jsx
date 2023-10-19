import "./toast.css";

const ToastBar = ({ message, show }) => {
  return (
    <div className={`toast-bar ${show ? "show" : ""}`}>
      <span>{message}</span>
    </div>
  );
};

export default ToastBar;
