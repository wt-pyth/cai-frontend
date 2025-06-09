import React, { useContext, useState } from 'react';
import FormBuilder from 'antd-form-builder';
import { toast } from 'react-toastify';
import {
  Form, Button, Modal, Checkbox, Input, Select
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan,
  faCircleQuestion,
  faEnvelope,
  faFloppyDisk,
  faLock,
  faPlus,
  faTrash,
  faTriangleExclamation,
  faUserShield,
  faXmark
} from '@fortawesome/pro-solid-svg-icons';
import { userContext } from 'contexts/Auth';
import { AUTH_PATH } from 'constants/site';

const userMetaCreate = {
  fields: [
    {
      key: 'email',
      label: 'User Email',
      required: true,
      placeholder: 'abc@example.com',
      message: 'Please enter a valid email address',
      rules: [
        {
          type: 'email',
          message: 'The input is not valid E-mail!'
        }
      ]
    },
    {
      key: 'company',
      name: 'company', // Add name for form binding
      label: 'Company',
      required: true,
      widget: Select,
      widgetProps: {
        options: [], // Will be populated dynamically
        placeholder: 'Select Company',
        showSearch: true,
        optionFilterProp: 'label',
        optionLabelProp: 'label'
      }
    }
  ]
};

const userMetaEdit = {
  fields: [
    {
      key: 'email',
      label: 'User Email',
      required: true,
      placeholder: 'abc@example.com',
      message: 'Please enter a valid email address',
      rules: [
        {
          type: 'email',
          message: 'The input is not valid E-mail!'
        }
      ]
    },
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
    }
  ]
};

export const UserModel = ({
  onCancel, onSuccess, selectedCompany, userData
}) => {
  const { authToken, apiClient, companies } = useContext(userContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const isEditing = !!userData;

  const initialValues = isEditing
    ? {
      email: userData.email,
      company: selectedCompany
    }
    : {
      email: '',
      company: selectedCompany
    };

  const meta = isEditing
    ? { ...userMetaEdit, initialValues }
    : { ...userMetaCreate, initialValues };

  const companyOptions = companies.map((company) => ({
    label: company.name,
    value: company.uuid
  }));

  // Update company field options dynamically in CREATE mode
  if (!isEditing) {
    const companyField = meta.fields.find((field) => field.key === 'company');
    if (companyField) {
      companyField.widgetProps.options = companyOptions;
    }
  }

  const isUserAdmin = isEditing
    ? userData?.companies?.some((c) => c.company_uuid === selectedCompany && c.is_admin)
    : false;

  const createUser = async (values) => {
    const formData = { ...values, username: '-' };
    const response = await apiClient.get(
      `api/auth/user/invite/${values.company}/?email=${formData.email}`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    if (response.status === 200) {
      toast.success(response.data.message);
    } else {
      toast.error('Error adding user');
    }
  };

  const updateUser = async (values) => {
    const formData = { ...values, username: '-' };
    const response = await apiClient.put(
      `api/auth/companies/${selectedCompany}/users/${userData.id}/`,
      formData,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    if (response.status === 200) {
      toast.success('User updated successfully');
    } else {
      toast.error('Error updating user');
    }
  };

  const toggleAdmin = async () => {
    setIsSubmitting(true);
    try {
      if (isUserAdmin) {
        const res = await apiClient.delete(
          `api/auth/companies/${selectedCompany}/users/${userData.id}/role`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (res.status === 200) {
          toast.success('Admin role removed successfully');
        } else {
          toast.error('Error removing admin role');
        }
      } else {
        const res = await apiClient.get(
          `api/auth/companies/${selectedCompany}/users/${userData.id}/role`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (res.status === 200) {
          toast.success('User assigned as admin successfully');
        } else {
          toast.error('Error assigning admin role');
        }
      }
      onSuccess();
      onCancel();
    } catch (error) {
      toast.error(`Error toggling admin role: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = async () => {
    setIsSubmitting(true);
    try {
      const res = await apiClient.delete(
        `api/auth/companies/${selectedCompany}/users/${userData.id}/`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (res.status === 200) {
        toast.success('User deleted successfully');
      } else {
        toast.error('Error deleting user');
      }
      onSuccess();
      onCancel();
    } catch (error) {
      toast.error(`Error deleting user: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async (values) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateUser(values);
      } else {
        await createUser(values);
      }
      onSuccess();
      onCancel();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title={(
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lightText text-xl">
            {isEditing ? 'Edit User' : 'Add User'}
          </div>
          <div className="flex justify-end items-center gap-2">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-primary" />
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              onClick={onCancel}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
      open
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      width={800}
      footer={null}
      centered
      className="custom-user-modal"
      closable={false} // Hide default close icon
    >
      <div className="p-4">
        <p className={`${isEditing ? 'text-center' : ''} text-gray-700 mb-2 text-sm`}>
          {isEditing
            ? 'Edit user details within Capabara.'
            : 'Add a new user to the current company, a welcome email will be sent to them to join'}
        </p>
        <p className={`${isEditing ? 'text-center' : ''} text-gray-700 mb-4 text-sm`}>
          {isEditing ? ' ' : <span className="text-bar7">*</span>}
          {isEditing
            ? 'Changes here will affect all Capabara products for this user'
            : 'applicable notes if any'}
        </p>
        <Form id="userForm" form={form} initialValues={initialValues} onFinish={handleFinish}>
          <FormBuilder className="justify-center items-center" meta={meta} form={form} />
        </Form>
        <div className=" mt-6">
          <div className="flex gap-2 justify-center items-center mb-5">
            {isEditing && (
              <>
                <Button
                  type="primary"
                  onClick={toggleAdmin}
                  icon={<FontAwesomeIcon icon={faUserShield} className="mr-2" />}
                  loading={isSubmitting}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  {isUserAdmin ? 'Remove Admin' : 'Make User Admin'}
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    // Reset password logic here
                    toast.success('User Locked');
                  }}
                  icon={<FontAwesomeIcon icon={faLock} className="mr-2" />}
                  loading={isSubmitting}
                >
                  Lock User
                </Button>
                <Button
                  danger
                  type="primary"
                  onClick={deleteUser}
                  icon={<FontAwesomeIcon icon={faTrash} className="mr-2" />}
                  loading={isSubmitting}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Delete User
                </Button>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 ml-auto">
            <Button
              onClick={onCancel}
              disabled={isSubmitting}
              className="bg-gray-300 hover:bg-gray-400"
            >
              <FontAwesomeIcon icon={faBan} className="mr-2" />
              Cancel
            </Button>
            <Button
              type="primary"
              form="userForm"
              htmlType="submit"
              loading={isSubmitting}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              {isEditing ? (
                <>
                  <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
                  Save
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  Add User
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const CompanyModel = ({
  companyData, // null => Add mode, else => Edit mode
  onCancel,
  onSuccess,
  setDeleteModalOpen,
  setCompanyToDelete
}) => {
  const { apiClient } = useContext(userContext);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!companyData;

  // Set initial form values
  const initialValues = isEditing
    ? {
      companyName: companyData.name || ''
    }
    : {
      companyName: '',
      agreeTerms: false // for Add mode
    };

  const handleFinish = async (values) => {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        // Edit flow
        const res = await apiClient.put(`${AUTH_PATH}api/auth/companies/${companyData.uuid}/`, {
          name: values.companyName,
          email: values.companyEmail
        });
        if (res.status === 200) {
          toast.success(res.data.message);
        } else {
          toast.error('Error updating company');
        }
      } else {
        // Add flow
        if (!values.agreeTerms) {
          toast.error('You must agree to the terms before creating a company');
          setIsSubmitting(false);
          return;
        }
        const res = await apiClient.post(`${AUTH_PATH}api/auth/companies/`, {
          name: values.companyName
        });
        if (res.status === 201) {
          toast.success('New company added successfully');
        } else {
          toast.error('Error adding company');
        }
      }
      onSuccess();
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open
      onCancel={onCancel}
      footer={null}
      centered
      width={700}
      height={500}
      closable={false} // Hide default close icon
      title={(
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lightText text-xl">
            {isEditing
              ? `Edit
            ${companyData.name}`
              : 'Add Company'}
          </div>
          <div className="flex justify-end items-center gap-2">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-primary" />
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              onClick={onCancel}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
    >
      <div className="p-2">
        {isEditing ? (
          <p className="text-gray-700 mb-4">Edit company details within this application</p>
        ) : (
          <p className="text-gray-700 mb-4">
            Add a new company, as an admin you will be responsible for all account costs
          </p>
        )}

        <Form layout="horizontal" form={form} onFinish={handleFinish} initialValues={initialValues}>
          {isEditing ? (
            <Form.Item
              label="New Company Name"
              name="companyName"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input placeholder="Company Name" />
            </Form.Item>
          ) : (
            <>
              {/* Add Mode: single name field + terms checkbox */}
              <Form.Item
                label="Company"
                name="companyName"
                rules={[{ required: true, message: 'Please enter a company name' }]}
              >
                <Input placeholder="Company name" />
              </Form.Item>

              <Form.Item name="agreeTerms" valuePropName="checked">
                <Checkbox>
                  I agree by the full terms and conditions and take responsibility for any and all
                  payments required
                </Checkbox>
              </Form.Item>
            </>
          )}

          {isEditing && (
            <div className="flex justify-center items-center mb-4">
              <Button
                type="danger"
                onClick={() => {
                  setCompanyToDelete(companyData);
                  setDeleteModalOpen(true);
                }}
                icon={<FontAwesomeIcon icon={faTrash} className="mr-2" />}
                loading={isSubmitting}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Delete
              </Button>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              onClick={onCancel}
              disabled={isSubmitting}
              icon={<FontAwesomeIcon icon={faBan} className="mr-2" />}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              className={isEditing ? 'bg-orange-500 text-white' : 'bg-orange-500 text-white'}
              icon={
                isEditing ? (
                  <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
                ) : (
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                )
              }
            >
              {isEditing ? 'Save' : 'Add Company'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export const ActionConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
  action = 'delete', // 'delete' | 'makeAdmin' | 'removeAdmin' | 'resetPassword' | 'unassignSubscription'
  email,
  firstName,
  lastName,
  modalConfig // optional: override config (title, message, button, danger, icon)
}) => {
  const [confirmInput, setConfirmInput] = useState(''); // State for input field

  const iconMap = {
    delete: (
      <FontAwesomeIcon icon={faTriangleExclamation} style={{ fontSize: 48, color: '#fa8c16' }} />
    ),
    makeAdmin: (
      <FontAwesomeIcon
        icon={faUserShield}
        className="mr-2"
        style={{ fontSize: 48, color: '#fa8c16' }}
      />
    ),
    removeAdmin: (
      <FontAwesomeIcon
        icon={faUserShield}
        className="mr-2"
        style={{ fontSize: 48, color: '#fa8c16' }}
      />
    ),
    resendInvitation: <FontAwesomeIcon icon={faEnvelope} className="mr-2" style={{ fontSize: 48, color: '#fa8c16' }} />,
    unassignSubscription: <DeleteOutlined style={{ fontSize: 48, color: '#fa8c16' }} />
  };

  const defaultTexts = {
    delete: {
      title: email ? 'Delete Confirmation' : 'Delete Company Name', // Different title based on context
      message: email
        ? 'ALL associated records will be returned to the admin account\nThis action CANNOT be undone'
        : 'ALL associated records will be permanently deleted\nthis option CANNOT be undone',
      button: email ? 'Delete My Account' : 'Delete',
      danger: true,
      icon: <FontAwesomeIcon icon={faTrash} className="mr-2" />
    },
    makeAdmin: {
      title: 'Make user admin',
      message:
        'The selected user will be upgraded to an admin account, they will have access to all billing details',
      button: 'Make user admin',
      danger: false,
      icon: <FontAwesomeIcon icon={faUserShield} className="mr-2" />
    },
    removeAdmin: {
      title: 'Remove admin',
      message: 'The selected user will lose admin privileges and access to billing details',
      button: 'Remove admin',
      danger: true,
      icon: <FontAwesomeIcon icon={faUserShield} className="mr-2" />
    },
    resendInvitation: {
      title: 'Resend Invitation',
      message: 'Resend the invitation email to the user',
      button: 'Resend',
      danger: false,
      icon: <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
    },
    unassignSubscription: {
      title: 'Unassign Subscription',
      message: 'Are you sure you want to unassign this subscription seat?',
      button: 'Unassign',
      danger: true,
      icon: <DeleteOutlined />
    }
  };

  // Use modalConfig if provided; otherwise use defaults
  const config = modalConfig || defaultTexts[action] || defaultTexts.delete;

  // Handle input change for confirmation
  const handleInputChange = (e) => {
    setConfirmInput(e.target.value);
  };

  // Modified onConfirm to check input
  const handleConfirm = () => {
    if (action === 'delete') {
      if (email && confirmInput !== email) {
        return; // Prevent confirm if email doesn't match
      }
      if (!email && confirmInput !== firstName) {
        return; // Prevent confirm if company name doesn't match
      }
    }
    setConfirmInput(''); // Reset input after confirm
    onConfirm();
  };

  // Handle cancel
  const handleCancel = () => {
    setConfirmInput(''); // Reset input on cancel
    onCancel();
  };

  const renderMessage = (message) => {
    if (!message.includes('CANNOT')) {
      return <p className="mt-4 text-gray-700 whitespace-pre-line">{message}</p>;
    }

    // Split the message into parts around "CANNOT"
    const parts = message.split('CANNOT');
    return (
      <p className="mt-4 text-gray-700 whitespace-pre-line">
        {parts[0]}
        <span style={{ color: 'red' }}>CANNOT</span>
        {parts[1]}
      </p>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      centered
      closable={false}
      className="custom-action-modal w-500"
      width={500}
      height={email ? 379 : 293}
    >
      <div className="text-center">
        {iconMap[action]}
        <h2 className="mt-4 text-xl font-semibold">{config.title}</h2>

        {/* For company deletion, pass the company name as firstName */}
        {email && <p className="text-primary font-medium">{email}</p>}
        {firstName && (
          <p className="text-primary font-medium">
            {lastName ? `${lastName}, ${firstName}` : firstName}
          </p>
        )}
        {renderMessage(config.message)}

        {/* Add input field for delete action */}
        {action === 'delete' && (
          <div className="mt-4">
            {email && (
              <p className="text-gray-700">
                To confirm and continue to delete this
                {' '}
                {email ? 'account' : 'company'}
                {' '}
                please enter
                your
                {' '}
                {email ? 'email address' : 'company name'}
                {' '}
                below
              </p>
            )}
            <Input
              placeholder={email ? 'Enter email address' : 'Enter company name here to proceed'}
              value={confirmInput}
              onChange={handleInputChange}
              className="mt-2"
            />
          </div>
        )}

        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={handleCancel} icon={<FontAwesomeIcon icon={faBan} className="mr-2" />}>
            Cancel
          </Button>
          <Button
            type="primary"
            danger={config.danger}
            icon={config.icon}
            onClick={handleConfirm}
            disabled={
              action === 'delete'
              && ((email && confirmInput !== email) || (!email && confirmInput !== firstName))
            }
          >
            {config.button}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
