import {
  Button, Card, Form, Layout, Typography
} from 'antd';
import FormBuilder from 'antd-form-builder';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { userContext } from 'contexts/Auth';
import MainFooter from 'components/layouts/MainFooter';

const { Title } = Typography;
const { Content } = Layout;

const meta = {
  columns: 1,
  formItemLayout: [6, 20],
  fields: [
    {
      key: 'new_password1',
      label: 'Password',
      widget: 'password',
      required: true,
      placeholder: 'Please enter your password'
    }
  ]
};

const PwdResetConfirm = () => {
  const router = useRouter();
  const { uid, token } = router.query;
  const [loginForm] = Form.useForm();
  const { isAuth, resetPasswordConfirm } = useContext(userContext);

  const handleFinish = async (values) => {
    const nformData = { ...values };
    nformData.new_password2 = nformData.new_password1;
    nformData.uid = uid;
    nformData.token = token;
    await resetPasswordConfirm(nformData, router);
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
        <img className="w-60 mx-auto mb-12" src="/CAPABARA.png" alt="" />
        <Card
          className="w-6/12 block"
          style={{
            margin: '0 auto',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            maxWidth: '550px'
          }}
        >
          <Title className="text-center mb-8" level={2}>Password Reset Confirm</Title>
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

export default PwdResetConfirm;
