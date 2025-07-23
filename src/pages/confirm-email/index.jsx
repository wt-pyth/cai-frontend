import { Card, Layout, Typography } from 'antd';
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
      <div className="layout h-screen bg-containerColor text-white flex flex-col justify-between">
        <Content className="flex flex-col items-center">
          <div className="flex justify-center py-10">
            <img
              src="https://www.capabara.com/wp-content/uploads/2024/05/TM_Capabara-Logo-210622-Primary-Logo-2048x1620.png"
              alt="Capabara Logo"
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </div>
          <Card
            className="w-full max-w-[600px] p-6 shadow-lg bg-white border-2 !border-[#58595B80] !rounded-lg"
            bodyStyle={{ padding: 0 }}>
            <div className="text-center p-6">
              <Title level={3} className="!text-midGray mb-4">
                Email Verification
              </Title>
              <Text className="font-semibold !text-primary">Loading ...</Text>
            </div>
          </Card>
        </Content>
        <MainFooter />
      </div>
    );
  }

  return (
    <div className="layout h-screen bg-containerColor text-white flex flex-col justify-between">
      <Content className="flex flex-col items-center">
        <div className="flex justify-center py-10">
          <img
            src="https://www.capabara.com/wp-content/uploads/2024/05/TM_Capabara-Logo-210622-Primary-Logo-2048x1620.png"
            alt="Capabara Logo"
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </div>
        <Card
          className="w-full max-w-[600px] p-6 shadow-lg bg-white border-2 !border-[#58595B80] !rounded-lg"
          bodyStyle={{ padding: 0 }}>
          <div className="text-center p-6">
            <Title level={3} className="!text-midGray mb-4">
              Email Verification
            </Title>
            {apiResponse === 'Email verified successfully.' && (
              <div className="flex flex-col items-center gap-3">
                <Text className="font-semibold !text-primary">Verification is successful!</Text>
                <Text className="text-sm text-midGray">
                  You may now close this page or click the button to sign in and use Capabara
                  applications
                </Text>
                <a
                  href="/"
                  className="text-sm text-white !rounded-md bg-primary px-4 py-1 hover:bg-primary/80 hover:text-white">
                  Login
                </a>
              </div>
            )}
            {apiResponse === 'error' && (
              <div className="flex flex-col items-center gap-3">
                <Text className="font-semibold !text-primary">
                  Oops, verification is unsuccessful!
                </Text>
                <Text className="text-sm text-midGray">
                  There is in issue with your verification attempt. Please contact your
                  <strong> administrator </strong>
                  or <span className="text-primary font-semibold">support@capabara.com </span>
                  for assistance.
                </Text>
              </div>
            )}
            {apiResponse === 'Email already verified.' && (
              <div className="flex flex-col items-center gap-3">
                <Text className="!text-primary font-semibold">Your email is already verified.</Text>
                <a
                  href="/"
                  className="text-sm text-white !rounded-md bg-primary px-4 py-1 hover:bg-primary/80 hover:text-white">
                  Login
                </a>
              </div>
            )}
            {loading && (
              <Text className="!text-primary font-semibold">Verification in progress...</Text>
            )}
          </div>
        </Card>
      </Content>
      <MainFooter />
    </div>
  );
};

export default ConfirmEmail;
