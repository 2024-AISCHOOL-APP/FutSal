// TeamApplyModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
// import "./ModalComponent.css"; // 커스텀 스타일 적용

const ModalComponent = ({ show, handleClose, children, size }) => {
  return (
    <Modal
      className="custom-modal"
      show={show}
      onHide={handleClose}
      size={size}
    >
      <Modal.Header closeButton></Modal.Header>
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
