import { toast } from 'react-toastify';

const toastError = (error) => {
  Object.values(error.response.data).forEach((errList) => {
    if (Array.isArray(errList)) {
      errList.forEach((err) => {
        toast.error(err);
      });
    } else toast.error(errList);
  });
};

export default toastError;
