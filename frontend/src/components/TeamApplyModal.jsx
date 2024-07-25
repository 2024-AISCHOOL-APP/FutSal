// ModalComponent.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const ModalComponent = ({ show, handleClose, children }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>팀 가입 신청</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
