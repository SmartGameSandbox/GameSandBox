import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";
import "./modal.css";


const Modal = props => {
  //A function that closes the modal when the escape key is pressed
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };
  //Add the event listener to document body when the the modal component is mounted, remove it when modal unmounts
  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);
  //Render the modal component directly into the root element to avoid css positioning issues
  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
      nodeRef={props.nodeRef}

    >
      <div className="modal" ref={props.nodeRef}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h4 className="modal-title">{props.title}</h4>
            <button onClick={props.onClose} className="CloseModalBtnIcon">
              X
            </button>
          </div>
          <div className="modal-body">{props.children}</div>
          <div className="modal-footer">
            <br />
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default Modal;
