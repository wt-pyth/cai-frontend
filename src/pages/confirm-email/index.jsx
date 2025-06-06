import {
  Button, Card, Layout, Typography
} from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MainFooter from 'components/layouts/MainFooter';
import { AUTH_PATH } from 'constants/site';

const { Content } = Layout;
const { Title, Text } = Typography;

const ConfirmEmail = () => {
  const router = useRouter();
  const { email, key } = router.query;
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    if (!router.isReady || !email || !key || apiResponse !== null) return;

    const fetchConfirmation = async () => {
      setLoading(true);
      try {
        const encodedEmail = encodeURIComponent(email);
        const { data } = await axios.get(
          `${AUTH_PATH}api/auth/invite-confirm-email?email=${encodedEmail}&key=${key}`
        );
        setApiResponse(data.message || 'error');
      } catch (error) {
        setApiResponse('error');
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, email, key]);

  // Fallback UI when router is not ready or query parameters are missing
  if (!router.isReady || !email || !key) {
    return (
      <div className="layout h-screen bg-[rgb(12_74_110/var(--tw-bg-opacity,1))] text-white flex flex-col justify-between">
        <Content className="flex items-center justify-center flex-grow px-4">
          <Card
            className="w-full max-w-[400px] p-6 rounded-lg shadow-md bg-white"
            bodyStyle={{ padding: 0 }}
          >
            <div className="flex justify-center py-10">
              <img
                src="https://www.capabara.com/wp-content/uploads/2024/05/TM_Capabara-Logo-210622-Primary-Logo-2048x1620.png"
                alt="Capabara Logo"
                style={{ maxWidth: '200px', height: 'auto' }}
              />
            </div>
            <div className="text-center p-6">
              <Title level={3} className="text-[#1e3274] mb-4" style={{ color: '#1e3274 !important' }}>
                Email Confirmation
              </Title>
              <Text className="text-lg text-[#4a4a4a]">Loading...</Text>
            </div>
          </Card>
        </Content>
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="layout h-screen bg-[rgb(12_74_110/var(--tw-bg-opacity,1))] text-white flex flex-col justify-between">
      <Content className="flex items-center justify-center flex-grow px-4">
        <Card
          className="w-full max-w-[400px] p-6 rounded-lg shadow-md bg-white"
          bodyStyle={{ padding: 0 }}
        >
          <div className="flex justify-center py-10">
            <img
              src="https://www.capabara.com/wp-content/uploads/2024/05/TM_Capabara-Logo-210622-Primary-Logo-2048x1620.png"
              alt="Capabara Logo"
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </div>
          <div className="text-center p-6">
            <Title level={3} className="text-[#1e3274] mb-4" style={{ color: '#1e3274 !important' }}>
              Email Confirmation
            </Title>
            {apiResponse === 'Email verified successfully.' && (
              <>
                <Text className="text-lg text-[#f5a623] block mb-2">
                  Email Verification Successful!
                </Text>
                <Text className="text-sm text-[#6b7280]">You can close this page and sign into Capabara Platform and other Capabara Applications</Text>
                <br />
                <br />
                <Button type="primary" className="bg-[#2563eb] text-white">
                  <a href="/" className="text-[#2563eb]">
                    {' '}
                    Login
                  </a>
                </Button>
              </>
            )}
            {apiResponse === 'error' && (
              <>
                <Text className="text-lg text-[#dc2626]">Something went wrong! in Verification</Text>
                <br />
                <Button type="primary" className="bg-[#2563eb] text-white">
                  <a href="/resendemail" className="text-[#2563eb]">
                    {' '}
                    Resend-Email
                  </a>
                </Button>
              </>
            )}
            {apiResponse === 'Email already verified.' && (
              <>
                <Text className="text-lg text-[#2563eb]">Your email is already verified.</Text>
                <br />
                <br />
                <Button type="primary" className="bg-[#2563eb] text-white">
                  <a href="/" className="text-[#2563eb]">
                    {' '}
                    Login
                  </a>
                </Button>
              </>
            )}
            {loading && <Text className="text-lg text-[#4a4a4a]">Verification in progress...</Text>}
          </div>
        </Card>
      </Content>
      <MainFooter />
    </div>
  );
};

export default ConfirmEmail;
