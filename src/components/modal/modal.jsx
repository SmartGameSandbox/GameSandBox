import React from 'react';
import classes from './modal.module.css';

const Modal = (props) => {
  return (
    <div>
      <div className={classes.backdrop} onClick={props.onConfirm} />
      <div className={classes.modal}> 
        <header className={classes.header}>
        <div className={classes.titleCloseBtn}>
          <button onClick={props.onConfirm}>
            X
          </button>
        </div>
        </header>
        <main>{props.children}</main>
      </div>
    </div>
  );
};

export default Modal;