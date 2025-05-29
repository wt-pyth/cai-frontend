/* eslint-disable max-len */
import {
  Layout, Form, Input, Button, Typography, message
} from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFloppyDisk, faKey, faTrash, faUser
} from '@fortawesome/pro-solid-svg-icons';
import { useRouter } from 'next/router';
import MainLayout from 'components/layouts/Layout';
import { userContext } from 'contexts/Auth';

const { Content } = Layout;
const { Title, Text } = Typography;

const MyAccount = () => {
  const [detailsForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [deleteForm] = Form.useForm();
  const {
    user, setUser, logout, apiClient
  } = useContext(userContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      detailsForm.setFieldsValue({
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      });
      emailForm.setFieldsValue({
        current_email: user.email || ''
      });
    }
  }, [user, detailsForm, emailForm]);

  const handleDetailsSubmit = async (values) => {
    setLoading(true);
    try {
      await apiClient.patch('/api/auth/account/', {
        action: 'update_details',
        first_name: values.first_name,
        last_name: values.last_name
      });
      message.success('Details updated successfully');
      setUser((prevUser) => ({
        ...prevUser,
        first_name: values.first_name,
        last_name: values.last_name
      }));
    } catch (error) {
      message.error('Error updating details');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    setLoading(true);
    try {
      await apiClient.post('/api/auth/account/', {
        action: 'update_password',
        current_password: values.current_password,
        new_password: values.new_password
      });
      message.success('Password updated successfully');
      logout();
    } catch (error) {
      message.error('Error updating password');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (values) => {
    setLoading(true);
    try {
      await apiClient.post('/api/auth/account/', {
        action: 'update_email',
        new_email: values.new_email
      });
      message.success('Email update request sent. Please check your new email to verify.');
      setUser((prevUser) => ({
        ...prevUser,
        email: values.new_email
      }));
      logout();
    } catch (error) {
      message.error('Error updating email');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (values) => {
    if (values.email !== user.email) {
      message.error('Email does not match your current email address');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post('/api/auth/account/', {
        action: 'delete_account',
        email: values.email
      });
      message.success('Account deleted successfully');
      logout();
      router.push('/');
    } catch (error) {
      message.error('Error deleting account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Layout>
        <Content className="bg-lightGrayText">
          <div className="mx-auto">
            <div className="bg-darkBlueText h-[48px]">
              <div className="flex justify-between items-center px-4 p-2">
                <div className="flex items-center space-x-2 text-lg text-white font-semibold">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: '20px', color: '#fff' }} />
                  <span>My Account</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* My Details Section */}
                <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                  <Title level={4}>My Details</Title>
                  <Text className="text-gray-600">
                    Changes here will be reflected in all Capabara products
                  </Text>
                  <Form
                    form={detailsForm}
                    layout="vertical"
                    onFinish={handleDetailsSubmit}
                    className="mt-4 max-w-3xl"
                  >
                    <Form.Item
                      name="first_name"
                      label={<span>First Name:</span>}
                      rules={[{ required: true, message: 'Please enter your first name' }]}
                    >
                      <Input placeholder="Enter first name" />
                    </Form.Item>
                    <Form.Item
                      name="last_name"
                      label={<span>Last Name:</span>}
                      rules={[{ required: true, message: 'Please enter your last name' }]}
                    >
                      <Input placeholder="Enter last name" />
                    </Form.Item>
                    <Form.Item className="flex justify-end">
                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />}
                        loading={loading}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                </div>

                {/* My Password Section */}
                <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                  <Title level={4}>My Password</Title>
                  <Text className="text-gray-600">
                    When changing password we will keep you logged in here and remove any other
                    sessions
                  </Text>
                  <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordSubmit}
                    className="mt-4 max-w-3xl"
                  >
                    <Form.Item
                      name="current_password"
                      label={<span>Current Password:</span>}
                      rules={[{ required: true, message: 'Please enter your current password' }]}
                    >
                      <Input.Password placeholder="Enter current password" />
                    </Form.Item>
                    <Form.Item
                      name="new_password"
                      label={<span>New Password:</span>}
                      rules={[{ required: true, message: 'Please enter your new password' }]}
                    >
                      <Input.Password placeholder="Enter new password" />
                    </Form.Item>
                    <div className="flex justify-end items-center">
                      <Button
                        type="outline"
                        onClick={() => router.push('/password/reset')}
                        className="mr-2 border-primary text-primary"
                        icon={<FontAwesomeIcon icon={faKey} className="mr-2 text-primary" />}
                      >
                        Forgot Password
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />}
                      >
                        Save
                      </Button>
                    </div>
                  </Form>
                </div>

                {/* My Email Section */}
                <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                  <Title level={4}>My Email</Title>
                  <Text className="text-gray-600">
                    Your current email address is
                    {' '}
                    <span className="text-primary">{user?.email || '<email address>'}</span>
                  </Text>
                  <Form
                    form={emailForm}
                    layout="vertical"
                    onFinish={handleEmailSubmit}
                    className="mt-4 max-w-3xl"
                  >
                    <Form.Item name="current_email" label="Current Email:" className="hidden">
                      <Input disabled value={user?.email || ''} />
                    </Form.Item>
                    <Form.Item
                      name="new_email"
                      label={<span>New email address:</span>}
                      rules={[
                        { required: true, message: 'Please enter your new email address' },
                        { type: 'email', message: 'Please enter a valid email address' }
                      ]}
                    >
                      <Input placeholder="Enter new email address" />
                    </Form.Item>
                    <Text className="text-gray-600 block mb-4">
                      A confirmation link will be sent to the new address and you will be logged out
                      from all systems.
                    </Text>
                    <Form.Item className="flex justify-end">
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                </div>

                {/* Delete My Account Section */}
                <div className="mt-8 bg-white shadow-md rounded-lg p-6">
                  <Title level={4}>Delete My Account</Title>
                  <Text className="text-gray-600">
                    If you choose to delete your account all the associated records will be returned
                    to the admin account. This action CANNOT be undone.
                  </Text>
                  <Form
                    form={deleteForm}
                    layout="vertical"
                    onFinish={handleDeleteAccount}
                    className="mt-4 max-w-3xl"
                  >
                    <Form.Item
                      name="email"
                      label="Enter your email address to confirm:"
                      rules={[
                        { required: true, message: 'Please enter your email address' },
                        { type: 'email', message: 'Please enter a valid email address' }
                      ]}
                    >
                      <Input placeholder="Enter email address" />
                    </Form.Item>
                    <Form.Item className="flex justify-end">
                      <Button
                        type="primary"
                        danger
                        htmlType="submit"
                        loading={loading}
                        icon={<FontAwesomeIcon icon={faTrash} className="mr-2" />}
                      >
                        Delete My Account
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </MainLayout>
  );
};

export default MyAccount;
