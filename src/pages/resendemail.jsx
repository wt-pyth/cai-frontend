import {
  Button, Card, Form, Layout, Typography
} from 'antd';
import FormBuilder from 'antd-form-builder';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';

import MainFooter from 'components/layouts/MainFooter';
import { AUTH_PATH } from 'constants/site';
import toastError from 'utils/toastErrors';

const { Title } = Typography;
const { Content } = Layout;

const meta = {
  columns: 1,
  formItemLayout: [6, 20],
  fields: [
    {
      key: 'email',
      label: 'Email',
      required: true,
      placeholder: 'abc@example.com'
    }
  ]
};

const Resendemail = () => {
  const [loginForm] = Form.useForm();

  const handleFinish = async (values) => {
    try {
      await axios.post(`${AUTH_PATH}api/auth/resend-email/`, values);
      toast.success('Email Sent');
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <Layout className="layout h-screen">
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="p-20 pt-0"
      >
        <img className="w-80 mx-auto mb-12" src="/TM_CapabaraLogo-210622-PrimaryLogo.png" alt="" />
        <Card
          className="w-6/12 block"
          style={{
            margin: '0 auto',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            maxWidth: '550px'
          }}
        >
          <Title className="text-center mb-8" level={2}>
            Resend Email
          </Title>
          <Form form={loginForm} layout="horizontal" onFinish={handleFinish}>
            <FormBuilder meta={meta} />
            <Form.Item wrapperCol={{ span: 19, offset: 5 }} className="form-footer">
              <div className="flex justify-between items-center">
                <Button
                  style={{ borderRadius: '5px', marginLeft: '-3px' }}
                  htmlType="submit"
                  type="primary"
                >
                  Submit
                </Button>
                <Link href="/">
                  <span className="text-primary cursor-pointer">Back to Login</span>
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      <MainFooter />
    </Layout>
  );
};

export default Resendemail;
