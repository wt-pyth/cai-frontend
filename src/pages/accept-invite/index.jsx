/* eslint-disable camelcase */
import { Card, Layout } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import { AUTH_PATH } from 'constants/site';
import MainFooter from 'components/layouts/MainFooter';

const { Content } = Layout;
const AcceptInvite = () => {
  const router = useRouter();
  // eslint-disable-next-line no-unused-vars
  const { email, company_uuid } = router.query;
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    // Only run if email and company_uuid are available and API hasn't been called yet
    if (!email || !company_uuid || apiResponse !== null) return;

    const fetchConfirmation = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(`${AUTH_PATH}api/auth/companies/${company_uuid}/users/`, {
          email
        });
        setApiResponse(data.message || 'error');
      } catch (error) {
        setApiResponse(error.response?.data?.message || 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, company_uuid]);

  useEffect(() => {
    if (apiResponse === 'User added to company and registered in external systems successfully.') {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Verification completed successfully!!',
        footer: '<a href="/">Login</a>'
      }).then(() => {
        router.push('/'); // Redirect to login after success
      });
    } else if (apiResponse === 'error') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! in Verification',
        footer: '<a href="/resendemail">Resend-Email</a>'
      });
    } else if (apiResponse === 'User already exists in the company.') {
      Swal.fire({
        icon: 'info',
        title: 'Already exists in the company.',
        text: 'You are already a member of this company.',
        footer: '<a href="/">Login</a>'
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiResponse]);

  return (
    <Layout className="layout h-screen bg-[#F5F7FA] flex flex-col justify-between">
      {/* Header with Logo */}
      <div className="flex justify-center py-10">
        <img
          src="/TM_CapabaraLogo-210622-SecondaryLogo.png" // Replace with the correct capybara logo if different
          alt="Capabara Logo"
          className="h-20"
        />
      </div>

      {/* Content */}
      <Content className="flex items-center justify-center flex-grow">
        <Card
          className="w-[400px] p-6 rounded-lg shadow-md"
          bodyStyle={{ padding: 0 }}
        >
          <div className="text-center p-6">
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">Join the Company</h1>
            {loading ? (
              <p className="text-lg text-gray-600">Joining in progress...</p>
            ) : (
              <>
                {apiResponse === 'User added to company and registered in external systems successfully.' && (
                <>
                  <p className="text-lg text-[#F28C38] mb-2">You have successfully joined the company!</p>
                  <p className="text-sm text-gray-500">You may now close this page</p>
                </>
                )}
                {apiResponse === 'error' && (
                <p className="text-lg text-red-600">Something went wrong! in Joining</p>
                )}
                {apiResponse === 'User already exists in the company.' && (
                <p className="text-lg text-blue-600">You are already a member of this company.</p>
                )}
              </>
            )}
          </div>
        </Card>
      </Content>

      <MainFooter />
    </Layout>
  );
};
export default AcceptInvite;
