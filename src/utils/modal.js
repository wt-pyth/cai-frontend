import { useImperativeHandle } from 'react';

const useLoadModalVis = (ref, setModalVisible) => {
  useImperativeHandle(ref, () => ({
    showModal() {
      setModalVisible(true);
    },
    hideModal() {
      setModalVisible(false);
    }
  }));
};

export default useLoadModalVis;
