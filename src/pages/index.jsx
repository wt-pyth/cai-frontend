import {
  Button, Card, Divider, Form, Layout, Typography
} from 'antd';
import FormBuilder from 'antd-form-builder';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { userContext } from 'contexts/Auth';
import MainFooter from 'components/layouts/MainFooter';

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
    },
    {
      key: 'password',
      label: 'Password',
      widget: 'password',
      required: true,
      placeholder: 'Password'
    }
  ]
};

const LoginForm = () => {
  const [loginForm] = Form.useForm();
  const [disabled, setDisabled] = useState(false);
  const { isAuth, login } = useContext(userContext);
  const router = useRouter();

  const handleFinish = (values) => {
    login(values, setDisabled);
  };

  useEffect(() => {
    if (isAuth) {
      router.push('/myknowledge');
    }
  }, [isAuth, router]);

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
        <img className="w-80 mx-auto mb-12" src="/CapabaraR-KnowledgeSystemPrimary.png" alt="" />
        <Card
          className="w-6/12 block"
          style={{
            margin: '0 auto',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            maxWidth: '550px'
          }}
        >
          <Title className="text-center mb-8" level={2}>Login</Title>
          <Form
            form={loginForm}
            layout="horizontal"
            onFinish={handleFinish}
          >
            <FormBuilder meta={meta} />
            <Form.Item wrapperCol={{ span: 19, offset: 5 }} className="form-footer">
              <div className="flex justify-between items-center">
                <Button
                  style={{ borderRadius: '5px', marginLeft: '-3px' }}
                  htmlType="submit"
                  type="primary"
                  disabled={disabled}
                >
                  Submit
                </Button>
                <Link href="/password/reset/"><span className="text-primary cursor-pointer">Forgot Password?</span></Link>
              </div>
            </Form.Item>
          </Form>
          <Divider />
          <div className="text-center">
            Need an account?
            {' '}
            <Link href="/signup/"><span className="text-primary ml-2 cursor-pointer">Sign Up</span></Link>
          </div>
        </Card>
      </Content>
      <MainFooter />
    </Layout>
  );
};

export default LoginForm;
