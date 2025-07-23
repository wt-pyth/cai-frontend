import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Layout, Table, Button, Avatar, Spin, Tag, Empty, Typography } from 'antd';
import { LeftOutlined, RightOutlined, CloseOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import {
  faEnvelope,
  faLock,
  faPlus,
  faTrash,
  faUserGear,
  faUserShield
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toastError from 'utils/toastErrors';
import MainLayout from 'components/layouts/Layout';
import { userContext } from 'contexts/Auth';
import { UserModel, ActionConfirmModal } from 'utils/popUpModals';
import AssignSubscriptionModal from 'utils/AssignSubscriptionModal';
import SecondaryHeader from 'components/secondaryNav';
import { PERMISSIONS } from 'contexts/Permissions';
import AuthorizedUsage from 'components/AuthorizedUsage';
import useAuth from 'hooks/useAuth';

const { Content } = Layout;

const Users = () => {
  const { authToken, user, apiClient, selectedCompany, fetchCompanies } = useContext(userContext);
  const [userData, setUserData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalInfo, setModalInfo] = useState({
    visible: false,
    action: '',
    user: null,
    assignmentId: null
  });
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedUserForAssignment, setSelectedUserForAssignment] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const { can } = useAuth();

  const fetchUsers = async (companyId, page = 1, pageSize = 10) => {
    if (!companyId) return;
    setIsLoading(true);
    setUserData([]);
    try {
      const { data } = await apiClient.get(
        `api/auth/companies/${companyId}/users/?page=${page}&search=${searchText}&page_size=${pageSize}`
      );
      const uniqueUsers = Array.from(new Map(data.users.map((item) => [item.email, item])).values());
      setUserData(uniqueUsers);
      setPagination((prev) => ({
        ...prev,
        current: data.current_page,
        pageSize, // Use the provided pageSize
        total: data.total_users
      }));
    } catch (error) {
      toastError('Error fetching user data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignments = async (company) => {
    try {
      const res = await apiClient.get(`/api/auth/subscriptions/assignments/?company=${company}`);
      if (res.data && res.data.assignments) {
        setAssignments(res.data.assignments);
      }
    } catch (error) {
      toastError('Error fetching assignments');
    }
  };

  useEffect(() => {
    if (authToken && selectedCompany) {
      fetchCompanies();
      fetchUsers(selectedCompany);
      fetchAssignments(selectedCompany);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, selectedCompany, searchText]);

  // Derived merged data: combine userData with assignments.
  const mergedUserData = useMemo(
    () =>
      userData.map((record) => ({
        ...record,
        // Attach all assignments for this user
        assigned_subscription: record.id ? assignments.filter((a) => a.user_id === record.id) : []
      })),
    [userData, assignments]
  );

  // Action functions.
  const removeUser = async (userId, companyId) => {
    try {
      const res = await apiClient.delete(`api/auth/companies/${companyId}/users/${userId}/`);
      if (res.status === 200) toast.success('User deleted successfully');
      fetchUsers(selectedCompany);
    } catch (error) {
      toastError('Error removing user');
    }
  };

  const resendInvite = async (email, companyId) => {
    try {
      const res = await apiClient.post('api/auth/resend-invite-email/', { email, companyId });
      if (res.status === 200) toast.success(`Password reset email sent to ${email}`);
    } catch (error) {
      toastError('Error sending password reset link');
    }
  };

  const handleAssignRole = async (userId, companyId) => {
    try {
      const res = await apiClient.get(`api/auth/companies/${companyId}/users/${userId}/role`);
      if (res.status === 200) toast.success('User assigned as admin successfully');
      fetchUsers(selectedCompany);
    } catch (error) {
      toastError('Error assigning user as admin');
    }
  };

  const handleRemoveRole = async (userId, companyId) => {
    try {
      const res = await apiClient.delete(`api/auth/companies/${companyId}/users/${userId}/role`);
      if (res.status === 200) toast.success('User removed as admin successfully');
      fetchUsers(selectedCompany);
    } catch (error) {
      toastError('Error removing user as admin');
    }
  };

  const handleLockUser = async (userId, companyId) => {
    try {
      const res = await apiClient.post('/api/users/lock_user/', {
        company_id: companyId,
        user_id: userId,
        is_lock: true
      });
      if (res.status === 200) toast.success('User locked successfully');
      fetchUsers(selectedCompany);
    } catch (error) {
      toastError('Error locking user');
    }
  };

  const handleUnlockUser = async (userId, companyId) => {
    try {
      const res = await apiClient.post('/api/users/lock_user/', {
        company_id: companyId,
        user_id: userId,
        is_lock: false
      });
      if (res.status === 200) toast.success('User unlocked successfully');
      fetchUsers(selectedCompany);
    } catch (error) {
      toastError('Error unlocking user');
    }
  };

  // Open the dynamic action modal.
  const openActionModal = (action, record, companyId) => {
    setModalInfo({
      visible: true,
      action,
      user: {
        id: record.id,
        companyId,
        email: record.email,
        first_name: record.first_name,
        last_name: record.last_name
      }
    });
  };

  const openUnassignModal = (assignmentId, subscriptionName, record, companyId) => {
    setModalInfo({
      visible: true,
      action: 'unassignSubscription',
      assignmentId,
      user: {
        id: record.id,
        companyId,
        email: record.email,
        first_name: record.first_name,
        last_name: record.last_name
      },
      subscriptionName
    });
  };

  // Confirm action from the dynamic modal.
  const handleModalConfirm = async () => {
    const { user: modalUser, action, assignmentId } = modalInfo;
    if (!modalUser) return;
    if (action === 'delete') await removeUser(modalUser.id, modalUser.companyId);
    if (action === 'makeAdmin') await handleAssignRole(modalUser.id, modalUser.companyId);
    if (action === 'removeAdmin') await handleRemoveRole(modalUser.id, modalUser.companyId);
    if (action === 'resendInvitation') await resendInvite(modalUser.email, modalUser.companyId);
    if (action === 'lockUser') await handleLockUser(modalUser.id, modalUser.companyId);
    if (action === 'unlockUser') await handleUnlockUser(modalUser.id, modalUser.companyId);
    if (action === 'unassignSubscription') {
      try {
        const res = await apiClient.post('/api/auth/subscriptions/unassign/', {
          assigned_subscription_id: assignmentId,
          company: selectedCompany
        });
        if (res.status === 200) {
          toast.success('Subscription unassigned successfully');
          fetchAssignments(selectedCompany);
          fetchUsers(selectedCompany);
        } else {
          toastError('Error unassigning subscription');
        }
      } catch (error) {
        toastError('Error unassigning subscription');
      }
    }
    setModalInfo({ visible: false, action: '', user: null });
  };

  const openAssignSubscriptionModal = (record) => {
    setSelectedUserForAssignment(record);
    setAssignModalVisible(true);
  };

  const handleAssignmentComplete = () => {
    setAssignModalVisible(false);
    setSelectedUserForAssignment(null);
    fetchAssignments(selectedCompany);
    fetchUsers(selectedCompany); // refresh if user data now includes assignment info
  };

  // Table columns.
  const columns = [
    {
      title: '',
      dataIndex: 'first_name',
      key: 'first_name',
      width: 20,
      render: (text) => (
        <Avatar style={{ backgroundColor: '#3B505C', color: '#fff' }} size="large">
          {text?.charAt(0).toUpperCase()}
        </Avatar>
      )
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      render: (text) => <span className="ml-2 font-medium">{text}</span>
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      render: (text) => <span className="font-medium text-gray-800">{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span className="text-gray-600">{text}</span>
    },
    {
      title: 'Invited',
      dataIndex: 'invited',
      key: 'invited',
      render: (text) => (
        <Tag color={text ? 'green' : 'orange'} className="font-semibold">
          {text ? 'Invited' : 'Joined'}
        </Tag>
      )
    },
    {
      title: 'Subscription',
      dataIndex: 'assigned_subscription',
      key: 'assigned_subscription',
      render: (userAssignments, record) => (
        <div className="flex flex-wrap gap-2">
          {record.id && record.id === user.id && (
            <Tag className="font-bold text-primary bg-primary/10">Owner</Tag>
          )}
          {userAssignments.map((sub) => (
            <Tag key={sub.assignment_id} className="font-semibold">
              {sub.subscription_name}
              <CloseOutlined
                className="ml-1"
                onClick={() =>
                  openUnassignModal(
                    sub.assignment_id,
                    sub.subscription_name,
                    record,
                    selectedCompany
                  )
                }
              />
            </Tag>
          ))}
          {record.id !== user.id && record.email !== user.email && (
            <FontAwesomeIcon
              icon={faPlus}
              onClick={() => openAssignSubscriptionModal(record)}
              className="text-primary bg-primary/10 rounded p-0.5 border-2 border-dashed border-gray-400"
            />
          )}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const companyData = record.companies?.find((comp) => comp.company_uuid === selectedCompany);
        const isAdmin = companyData?.is_admin;
        const isLocked = companyData?.is_lock || false;

        return (
          <div className="flex space-x-2">
            <AuthorizedUsage permission={PERMISSIONS.USERS_SET_ADMIN}>
              {!record.invited && (
                <Button
                  type="text"
                  icon={
                    <FontAwesomeIcon
                      icon={faUserShield}
                      className={`${isAdmin ? 'text-primary' : 'text-gray-500'}`}
                    />
                  }
                  title={isAdmin ? 'Remove Admin Role' : 'Make Admin'}
                  onClick={() =>
                    openActionModal(
                      isAdmin ? 'removeAdmin' : 'makeAdmin',
                      record,
                      companyData.company_uuid
                    )
                  }
                />
              )}
            </AuthorizedUsage>
            <AuthorizedUsage permission={PERMISSIONS.USERS_LOCK}>
              {!record.invited && record.email !== user?.email && (
                <Button
                  type="text"
                  icon={
                    <FontAwesomeIcon
                      icon={faLock}
                      className={`${isLocked ? 'text-primary' : 'text-orange-500'}`}
                    />
                  }
                  title={isLocked ? 'Unlock User' : 'Lock User'}
                  onClick={() =>
                    openActionModal(
                      isLocked ? 'unlockUser' : 'lockUser',
                      record,
                      companyData.company_uuid
                    )
                  }
                />
              )}
            </AuthorizedUsage>

            {!record.joined && (
              <Button
                type="text"
                icon={<FontAwesomeIcon icon={faEnvelope} />}
                className="text-gray-500"
                title="Resend Invitation"
                onClick={() => openActionModal('resendInvitation', record, selectedCompany)}
              />
            )}
            <AuthorizedUsage permission={PERMISSIONS.USERS_DELETE}>
              {!isAdmin && record.email !== user?.email && !record.invited && (
                <Button
                  type="text"
                  icon={<FontAwesomeIcon icon={faTrash} />}
                  className="text-gray-500"
                  title="Delete User"
                  onClick={() => openActionModal('delete', record, companyData.company_uuid)}
                />
              )}
            </AuthorizedUsage>
          </div>
        );
      }
    }
  ];

  const handleTableChange = (paginationConfig) => {
    const { current, pageSize } = paginationConfig;
    setPagination({
      ...paginationConfig,
      current,
      pageSize
    });
    fetchUsers(selectedCompany, current, pageSize);
  };

  const debouncedSearch = useMemo(() => {
    const handleSearch = (value) => {
      setSearchText(value);
      setPagination((prev) => ({ ...prev, current: 1 }));
    };
    return (value) => {
      clearTimeout(window.searchTimeout);
      window.searchTimeout = setTimeout(() => handleSearch(value), 500);
    };
  }, []);

  return (
    <MainLayout>
      <Layout>
        <Content className="bg-gray-100">
          <div className="mx-auto">
            <div className="bg-darkBlueText h-[48px]">
              <SecondaryHeader
                title="Users"
                icon={faUserGear}
                searchValue={searchInputValue}
                setSearchValue={setSearchInputValue}
                debouncedSearch={debouncedSearch}
                onAdd={() => {
                  setEditingUser(null);
                  setIsUserModalOpen(true);
                }}
                addButtonText="Add User"
                showAddButton={can.addUsers()}
              />
            </div>
            <div className="bg-white">
              <AuthorizedUsage
                permission={PERMISSIONS.USERS_VIEW}
                fallback={
                  <div className="h-[80vh] flex flex-col items-center justify-center">
                    <Empty
                      description={
                        <Typography.Text>
                          You do not have permission to view this section. Please contact your
                          administrator.
                        </Typography.Text>
                      }></Empty>
                  </div>
                }>
                <Spin spinning={isLoading} tip="Loading users...">
                  <Table
                    dataSource={mergedUserData}
                    rowKey="email"
                    pagination={{
                      ...pagination,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '25', '50', '100'],
                      itemRender: (page, type, originalElement) => {
                        if (type === 'prev') {
                          return <Button icon={<LeftOutlined />} size="small" />;
                        }
                        if (type === 'next') {
                          return <Button icon={<RightOutlined />} size="small" />;
                        }
                        return originalElement;
                      }
                    }}
                    onChange={handleTableChange}
                    columns={columns}
                  />
                </Spin>
              </AuthorizedUsage>
            </div>
          </div>
        </Content>
        {isUserModalOpen && (
          <UserModel
            onCancel={() => {
              setIsUserModalOpen(false);
              setEditingUser(null);
            }}
            onSuccess={() => {
              setIsUserModalOpen(false);
              setEditingUser(null);
              fetchUsers(selectedCompany);
            }}
            selectedCompany={selectedCompany}
            userData={editingUser}
          />
        )}
        <ActionConfirmModal
          visible={modalInfo.visible}
          onCancel={() => setModalInfo({ ...modalInfo, visible: false })}
          onConfirm={handleModalConfirm}
          action={modalInfo.action}
          email={modalInfo.user?.email}
          firstName={modalInfo.user?.first_name}
          lastName={modalInfo.user?.last_name}
        />

        {assignModalVisible && selectedUserForAssignment && (
          <AssignSubscriptionModal
            visible={assignModalVisible}
            onCancel={() => setAssignModalVisible(false)}
            onAssigned={handleAssignmentComplete}
            userRecord={selectedUserForAssignment}
          />
        )}
      </Layout>
    </MainLayout>
  );
};
export default Users;
