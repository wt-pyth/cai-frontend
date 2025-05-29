import {
  Button, Card, Checkbox, Form, Layout, Typography
} from 'antd';
import FormBuilder from 'antd-form-builder';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { userContext } from 'contexts/Auth';
import MainFooter from 'components/layouts/MainFooter';

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
      key: 'Activity Code',
      label: 'Activity Code',
      required: false,
      placeholder: 'Activity Code'
    },
    {
      key: 'company',
      label: 'Company',
      required: true,
      placeholder: 'Company'
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
  const { isAuth, register } = useContext(userContext);
  const router = useRouter();

  const handleFinish = (values) => {
    register(values, setDisabled);
  };

  useEffect(() => {
    if (isAuth) {
      router.push('/mycapabara');
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
        <img className="w-80 mx-auto mb-12" src="/TM_CapabaraLogo-210622-PrimaryLogo.png" alt="" />
        <Card
          className="w-7/12 block"
          style={{
            margin: '0 auto',
            borderRadius: '10px',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            maxWidth: '600px'
          }}
        >
          <Title className="text-center mb-8" level={2}>Signup</Title>
          <Form
            form={loginForm}
            layout="horizontal"
            onFinish={handleFinish}
          >
            <FormBuilder meta={meta} />
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
              wrapperCol={{
                offset: 5,
                span: 20
              }}
            >
              <Checkbox>
                <Text className="!text-sm">
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
                    className="!underline"
                  >
                    here
                  </a>
                  {' '}
                  to view
                </Text>
              </Checkbox>
            </Form.Item>
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
                <Link href="/"><span className="text-primary cursor-pointer">Back to Login</span></Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Content>
      <MainFooter />
    </Layout>
  );
};

export default SignupForm;
