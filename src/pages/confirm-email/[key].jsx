import { Layout } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import { AUTH_PATH } from 'constants/site';
import MainFooter from 'components/layouts/MainFooter';

const { Content } = Layout;
const ConfirmEmail = () => {
  const router = useRouter();
  const { query: key } = router;
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');

  useEffect(() => {
    const fetchConfirmation = async () => {
      if (!key) return;
      setLoading(true);
      try {
        await axios.post(`${AUTH_PATH}api/auth/confirm-email/`, key);
        setApiResponse('success');
      } catch (error) {
        setApiResponse('error');
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmation();

    if (apiResponse === 'success') {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Verification completed successfully!!',
        footer: '<a href="/">Login</a>'
      });
    } else if (apiResponse === 'error') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! in Verification',
        footer: '<a href="/resendemail">Resend-Email</a>'
      });
    }
  }, [key, apiResponse]);

  return (
    <Layout className="layout h-screen">
      <Content className="p-20 pt-50 flex flex-col items-center justify-center">
        {loading ? <h1 className="text-5xl text-center">Verification in progress</h1> : <h1 className="text-5xl text-center">Verification</h1> }
        <h1 className="text-xl mt-16 text-center">
          {apiResponse === 'success' && 'Verification completed successfully!!'}
          {apiResponse === 'error' && 'Something went wrong! in Verification'}
        </h1>
      </Content>
      <MainFooter />
    </Layout>
  );
};
export default ConfirmEmail;
