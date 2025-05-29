/* eslint-disable camelcase */

import {
  Button, Card, Checkbox, Form, Layout, Modal, Typography
} from 'antd';
import FormBuilder from 'antd-form-builder';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { userContext } from 'contexts/Auth';
import MainFooter from 'components/layouts/MainFooter';
import { AUTH_PATH } from 'constants/site';

const { Text, Title } = Typography;
const { Content } = Layout;

const meta = {
  columns: 1,
  formItemLayout: [8, 20],
  fields: [
    {
      key: 'first_name',
      label: 'First Name',
      required: true,
      placeholder: 'John'
    },
    {
      key: 'last_name',
      label: 'Last Name',
      required: true,
      placeholder: 'Doe'
    },
    {
      key: 'email',
      label: 'Email',
      required: true,
      placeholder: 'abc@example.com'
    },
    {
      key: 'activity_code',
      label: 'Activity Code',
      required: false,
      placeholder: 'Activity Code'
    },
    {
      key: 'password1',
      label: 'Password',
      widget: 'password',
      required: true,
      placeholder: 'Password'
    }
  ]
};

const SignupForm = () => {
  const [loginForm] = Form.useForm();
  const [disabled, setDisabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ first_name: '', last_name: '', email: '' });
  const { isAuth } = useContext(userContext);
  const router = useRouter();
  const { email: queryEmail, company_uuid } = router.query;

  // Redirect if email or company_uuid is missing
  useEffect(() => {
    // Ensure router.query is ready (Next.js might not have query params on initial render)
    if (!router.isReady) return;

    // Check if email or company_uuid is missing
    if (!queryEmail || !company_uuid) {
      // Prevent redirect loop by checking if we're already on /signup without query params
      if (router.asPath !== '/signup') {
        router.replace('/signup');
      }
    }
  }, [router, router.isReady, queryEmail, company_uuid]);

  const handleFinish = async (values) => {
    setDisabled(true);
    try {
      const formData = { ...values, username: '-' };
      const response = await axios.post(`${AUTH_PATH}api/auth/companies/${company_uuid}/users/`, formData);
      if (response.status === 201) {
        setModalData({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email
        });
        setIsModalVisible(true);
        toast.success('User created successfully. Verification email sent!');
      } else {
        toast.error('Error adding user');
      }
    } catch (error) {
      toast.error('Error adding user');
    } finally {
      setDisabled(false);
    }
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    router.push('/');
  };

  useEffect(() => {
    if (queryEmail && company_uuid) {
      loginForm.setFieldsValue({
        email: queryEmail || '',
        first_name: '',
        last_name: '',
        password1: '',
        privacy: false
      });
    }
  }, [queryEmail, company_uuid, loginForm]);

  useEffect(() => {
    if (isAuth) {
      router.push('/mycapabara');
    }
  }, [isAuth, router]);

  return (
    <Layout className="layout h-screen flex flex-col">
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="p-20 pt-0"
      >
        <img className="w-20 mx-auto mb-12" src="/TM_CapabaraLogo-210622-PrimaryLogo.png" alt="" />
        <Card
          className="w-7/12 block"
          style={{
            margin: '0 auto',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            maxWidth: '800px'
          }}
        >
          <Title className="text-center mb-8" level={2}>
            Signup
          </Title>
          <Form form={loginForm} layout="horizontal" onFinish={handleFinish}>
            <FormBuilder meta={meta} form={loginForm} />
            <Form.Item
              name="privacy"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) => (value && value !== false
                    ? Promise.resolve()
                    : Promise.reject(new Error('Please read and acknowledge the Privacy notice')))
                }
              ]}
              className="flex justify-center"
            >
              <Checkbox>
                <Text className="text-sm">
                  I have read and acknowledged the Data Protection notice
                  {' '}
                  <br />
                  {' '}
                  Click
                  {' '}
                  <a
                    href="https://capabara.com/data-protection-notice/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    here
                  </a>
                  {' '}
                  to view
                </Text>
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <div className="flex justify-center gap-8 items-center mx-auto">
                <Button
                  className="rounded-md"
                  htmlType="submit"
                  type="primary"
                  disabled={disabled}
                >
                  Sign up
                </Button>
                <Link href="/login">
                  <span className="text-primary cursor-pointer">Back to Login</span>
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Content>

      {/* Signup Confirmation Modal */}
      <Modal
        title={(
          <div className="flex justify-between items-center">
            <div className="font-semibold text-lightText text-xl">
              Signup Confirmation
            </div>
            <div className="flex justify-end items-center gap-2">
              <FontAwesomeIcon icon={faCircleQuestion} className="text-primary" />
              <FontAwesomeIcon
                icon={faXmark}
                size="lg"
                className="cursor-pointer"
              />
            </div>
          </div>
        )}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalOk}
        width={700}
        height={50}
        footer={[
          <Button key="return" type="primary" onClick={handleModalOk} className="bg-yellow-500 border-yellow-500">
            Return to Login
          </Button>
        ]}
        closable={false}
      >
        <div className="text-gray-600 font-sans leading-relaxed text-center">
          <p>
            Hi,
            {' '}
            <span className="text-primary">
              {modalData.first_name}
              {' '}
              {modalData.last_name}
            </span>
          </p>
          <p>
            An email has been sent to
            {' '}
            <span className="text-primary">{modalData.email}</span>
          </p>
          <p>Please check and activate your account to login.</p>
          <p>
            If you do not receive an email please contact
            {' '}
            <a href="mailto:support@capabara.com" className="text-primary">
              support@capabara.com
            </a>
          </p>
        </div>
      </Modal>
      <MainFooter />
    </Layout>
  );
};

export default SignupForm;
