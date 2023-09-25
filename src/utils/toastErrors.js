import { toast } from 'react-toastify';

const toastError = (error) => {
  Object.values(error.response.data).forEach((errList) => {
    errList.forEach((err) => {
      toast.error(err);
    });
  });
};

export default toastError;
