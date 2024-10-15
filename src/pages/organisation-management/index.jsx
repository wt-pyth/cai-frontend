/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Layout, Table, Button
} from 'antd';
import toastError from 'utils/toastErrors';
import MainFooter from 'components/layouts/MainFooter';
import Navbar from 'components/layouts/Navbar';
import { userContext } from 'contexts/Auth';
import { apiDelete, apiGet } from 'services/api';
import { AUTH_PATH } from 'constants/site';
import { UserModel, AddApplicationModel } from 'utils/popUpModals';

const { Content } = Layout;

const OrganisationManagement = () => {
  const [userData, setUserData] = useState(null);
  const [editUserEmail, setEditUserEmail] = useState(null);
  const [userID, setUserID] = useState(null);
  const { authToken, user } = useContext(userContext);

  const fetchData = async () => {
    try {
      const response = await apiGet('/users/', authToken);
      setUserData(response);
    } catch (error) {
      toastError('Error fetching data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeUser = async (id) => {
    try {
      await apiDelete(`/users/${id}`, authToken);
      toast.success('User delete success');
      fetchData();
    } catch (error) {
      toastError('Error removing user');
    }
  };

  const handleAddUserSuccess = () => {
    fetchData();
    setEditUserEmail(null);
  };

  const handleAssignApplications = (id) => {
    setUserID(id);
  };

  const handleEditUser = (email) => {
    setEditUserEmail(email);
  };

  const handleCancelEdit = () => {
    setEditUserEmail(null);
    setUserID(null);
  };

  const sendPasswordReset = async (email) => {
    try {
      await axios.post(`${AUTH_PATH}api/auth/password/reset/`, { email });
      toast.success(`Password Reset e-mail sent! for ${email}`);
    } catch (error) {
      toast.error('Error sending password reset link');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Firstname', dataIndex: 'first_name', key: 'first_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'CompanyID', dataIndex: 'comapny_id', key: 'comapny_id' },
    { title: 'SSOID', dataIndex: 'capAuthUUID', key: 'capAuthUUID' },
    {
      title: 'Applications',
      dataIndex: 'assigned_applications',
      key: 'assigned_applications',
      render: (applications) => (
        <span>
          {applications.map((app, index) => (
            <span key={app.id}>
              {app.name}
              {index !== applications.length - 1 && ', '}
            </span>
          ))}
        </span>
      )
    },
    {
      title: 'Actions',
      render: (_text, record) => (
        <div>
          <Button className="mr-4" onClick={() => handleAssignApplications(record.capAuthUUID)}>
            Edit Applications
          </Button>
          <Button className="mr-4" onClick={() => sendPasswordReset(record.email)}>
            Reset Password
          </Button>
          {record.id === user?.profile?.user ? (
            ''
          ) : (
            <Button onClick={() => removeUser(record.id)} danger>
              Remove User
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <Layout className="layout h-screen">
      <Navbar />
      <Content>
        <div className="mx-4">
          <div className="my-6 flex justify-between">
            <h1 className="text-4xl">User Management</h1>
            <Button onClick={() => handleEditUser(user.email)} type="primary">
              Add Users
            </Button>
          </div>
          {userData ? (
            <Table
              className=""
              dataSource={userData}
              columns={columns}
              pagination={{ pageSize: 10 }}
              rowKey="id"
            />
          ) : (
            'No data available yet'
          )}
        </div>
      </Content>
      <MainFooter />
      {editUserEmail && <UserModel onCancel={handleCancelEdit} onSuccess={handleAddUserSuccess} />}
      {userID && (
        <AddApplicationModel
          onCancel={handleCancelEdit}
          onSuccess={handleAddUserSuccess}
          userData={userData}
          userID={userID}
        />
      )}
    </Layout>
  );
};

export default OrganisationManagement;
