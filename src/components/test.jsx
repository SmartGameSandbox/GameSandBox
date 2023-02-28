import React from "react";
import Button from '@mui/material/Button';
import { useState } from "react";
import Modal from "./modal/modal";
import BuildGame from "./buildGame/createGame";


const Test = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
        setOpen(false)
  }
  
  return (
    <>
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            {open &&  <Modal
            onConfirm = {handleClose}
            title = {"hello"}>

              <BuildGame/>
            </Modal>
            }

            


        </div>
    </>
  );
};
export default Test;
