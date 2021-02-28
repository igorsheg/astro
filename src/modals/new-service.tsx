import React, { FC } from 'react';
import Modal from 'src/components/modal';

interface NewServiceModalProps {
  title: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

const NewServiceModal: FC<NewServiceModalProps> = ({
  title,
  isOpen,
  onRequestClose,
}) => {
  return (
    <div>
      <Modal onRequestClose={onRequestClose} isOpen={isOpen} title={title}>
        Hey!
      </Modal>
    </div>
  );
};

export default NewServiceModal;
