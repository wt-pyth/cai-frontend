import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import FormBuilder from 'antd-form-builder';
import { toast } from 'react-toastify';
import {
  Form, Button, Modal, Checkbox
} from 'antd';
import { userContext } from 'contexts/Auth';
import { AUTH_PATH } from 'constants/site';
import { apiPost } from 'services/api';

const meta = {
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

export const UserModel = ({ onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const { authToken } = useContext(userContext);

  const addUser = async (values) => {
    try {
      const formData = { ...values };
      formData.username = '-';
      formData.password2 = values.password1;
      const ssoRegister = await axios.post(`${AUTH_PATH}api/auth/register/`, formData, {
        headers: { Authorization: `Token ${authToken}` }
      });
      const capAuthUUID = ssoRegister.data.user_id;
      await apiPost('/users/', { ...formData, capAuthUUID }, authToken);
      toast.success('Registration successful. Verification e-mail sent!');
      onSuccess();
      onCancel();
    } catch (error) {
      toast.error(`Error adding user: ${error.message}`);
    }
  };

  return (
    <Modal
      title="Add User"
      open
      onCancel={onCancel}
      okText="Add"
      cancelText="Cancel"
      width={800}
      footer={(
        <div className="flex justify-end">
          <Button type="primary" htmlType="submit" form="addUserForm">
            Add
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </div>
      )}
    >
      <Form form={form} layout="horizontal" onFinish={addUser} id="addUserForm">
        <FormBuilder meta={meta} />
      </Form>
    </Modal>
  );
};

export const AddApplicationModel = ({
  onCancel, onSuccess, userID, userData
}) => {
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const { authToken } = useContext(userContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${AUTH_PATH}o/get/applications/`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        setCompanyData(response.data);
      } catch (error) {
        toast.error('Error fetching company data');
      }
    };
    fetchData();
  }, [authToken]);

  useEffect(() => {
    if (userData) {
      const user = userData.find((getUser) => getUser.capAuthUUID === userID);
      if (user) {
        setSelectedApplications(user.assigned_applications.map((app) => app.id));
      }
    }
  }, [userID, userData]);

  const handleCheckboxChange = (companyId, checked) => {
    setSelectedApplications((prevState) => {
      if (checked) {
        return [...prevState, companyId];
      }
      return prevState.filter((id) => id !== companyId);
    });
  };

  const updateApplications = async () => {
    try {
      const newApplications = selectedApplications.filter(
        (appId) => !userData
          .find((user) => user.capAuthUUID === userID)
          ?.assigned_applications.some((app) => app.id === appId)
      );
      const removedApplications = userData
        .find((user) => user.capAuthUUID === userID)
        ?.assigned_applications.filter((app) => !selectedApplications.includes(app.id))
        .map((app) => app.id);
      await axios.post(
        `${AUTH_PATH}o/application/${userID}/`,
        { add_application_ids: newApplications, delete_application_ids: removedApplications },
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );
      toast.success('Applications updated successfully');
      onSuccess();
      onCancel();
    } catch (error) {
      toast.error(`Error updating applications: ${error.message}`);
    }
  };

  return (
    <Modal
      title="Assign Applications"
      open
      width={600}
      onCancel={onCancel}
      footer={(
        <>
          <Button key="assign" type="primary" onClick={updateApplications}>
            Update
          </Button>
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>
        </>
      )}
    >
      <Form className="flex flex-col gap-3 overflow-auto  max-h-[500px]">
        {companyData.map((company) => (
          <Checkbox
            className="!m-0"
            key={company.id}
            checked={selectedApplications.includes(company.id)}
            onChange={(e) => handleCheckboxChange(company.id, e.target.checked)}
          >
            {company.name}
          </Checkbox>
        ))}
      </Form>
    </Modal>
  );
};
