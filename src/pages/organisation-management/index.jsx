// /* eslint-disable react-hooks/exhaustive-deps */
// import React, {
//   useState, useEffect, useContext, useCallback
// } from 'react';
// import { toast } from 'react-toastify';
// import {
//   Layout, Table, Button, Tabs
// } from 'antd';
// import toastError from 'utils/toastErrors';
// import MainFooter from 'components/layouts/MainFooter';
// import { userContext } from 'contexts/Auth';
// import { ActionConfirmModal, CompanyModel, UserModel } from 'utils/popUpModals';
// import MainLayout from 'components/layouts/Layout';

// const { Content } = Layout;

// const OrganisationManagement = () => {
//   const [userData, setUserData] = useState([]);
//   const [isUserModalOpen, setIsUserModalOpen] = useState(false);
//   const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
//   const [modalInfo, setModalInfo] = useState({
//     visible: false,
//     action: '',
//     user: null
//   });

//   const {
//     authToken,
//     user,
//     apiClient,
//     selectedCompany,
//     setSelectedCompany,
//     companies,
//     setCompanies
//   } = useContext(userContext);

//   const fetchUsers = useCallback(
//     async (companyId) => {
//       if (!companyId) return;
//       setUserData([]);
//       try {
//         const { data } = await apiClient.get(`api/auth/companies/${companyId}/users/`);
//         setUserData(data);
//       } catch (error) {
//         toastError('Error fetching user data');
//       }
//     },
//     [authToken]
//   );

//   // const fetchCompanies = useCallback(async () => {
//   //   try {
//   //     const { data } = await apiClient.get('api/auth/user/companies/');
//   //     setCompanies(data);

//   //     if (data && data.length > 0) {
//   //       const defaultCompanyId = data[0].uuid;
//   //       setSelectedCompany(defaultCompanyId);
//   //       fetchUsers(defaultCompanyId);
//   //     }
//   //   } catch (error) {
//   //     toastError('Error fetching companies');
//   //   }
//   // }, [authToken, fetchUsers]);

//   useEffect(() => {
//     fetchCompanies();
//   }, [fetchCompanies]);

//   useEffect(() => {
//     if (selectedCompany) {
//       fetchUsers(selectedCompany);
//     }
//   }, [selectedCompany]);

//   const removeUser = async (userId, companyId) => {
//     try {
//       const res = await apiClient.delete(`api/auth/companies/${companyId}/users/${userId}/`);
//       if (res.status === 200) toast.success('User deleted successfully');
//       fetchUsers(selectedCompany);
//     } catch (error) {
//       toastError('Error removing user');
//     }
//   };

//   const sendPasswordReset = async (email) => {
//     try {
//       const res = await apiClient.post('api/auth/password/reset/', { email });
//       if (res.status === 200) toast.success(`Password reset email sent to ${email}`);
//     } catch (error) {
//       toastError('Error sending password reset link');
//     }
//   };

//   const handleUserModalSuccess = () => {
//     setIsUserModalOpen(false);
//     fetchUsers(selectedCompany);
//   };

//   const handleCompanyModalSuccess = () => {
//     setIsCompanyModalOpen(false);
//     fetchCompanies();
//   };

//   const handleAssignRole = async (userId, companyId) => {
//     try {
//       const res = await apiClient.get(`api/auth/companies/${companyId}/users/${userId}/role`, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       if (res.status === 200) toast.success('User assigned as admin successfully');
//       fetchUsers(selectedCompany);
//     } catch (error) {
//       toastError('Error assigning user as admin');
//     }
//   };

//   const handleRemoveRole = async (userId, companyId) => {
//     try {
//       const res = await apiClient.delete(`api/auth/companies/${c
// ompanyId}/users/${userId}/role`, {
//         headers: { Authorization: `Bearer ${authToken}` }
//       });
//       if (res.status === 200) toast.success('User removed as admin successfully');
//       fetchUsers(selectedCompany);
//     } catch (error) {
//       toastError('Error removing user as admin');
//     }
//   };

//   const openActionModal = (action, record, companyId) => {
//     setModalInfo({
//       visible: true,
//       action,
//       user: {
//         id: record.id,
//         companyId,
//         email: record.email,
//         first_name: record.first_name,
//         last_name: record.last_name
//       }
//     });
//   };

//   const handleModalConfirm = async () => {
//     const { user: modalUser, action } = modalInfo;
//     if (!modalUser) return;

//     if (action === 'delete') await removeUser(modalUser.id, modalUser.companyId);
//     if (action === 'makeAdmin') await handleAssignRole(modalUser.id, modalUser.companyId);
//     if (action === 'removeAdmin') await handleRemoveRole(modalUser.id, modalUser.companyId);
//     if (action === 'resetPassword') await sendPasswordReset(modalUser.email);

//     setModalInfo({ visible: false, action: '', user: null });
//   };

//   const columns = [
//     { title: 'ID', dataIndex: 'id', key: 'id' },
//     { title: 'Firstname', dataIndex: 'first_name', key: 'first_name' },
//     { title: 'Lastname', dataIndex: 'last_name', key: 'last_name' },
//     { title: 'Email', dataIndex: 'email', key: 'email' },
//     {
//       title: 'Actions',
//       render: (_text, record) => {
//         const companyData = record.companies.find(
//           (company) => company.company_uuid === selectedCompany
//         );
//         return (
//           <div>
//             <Button
//               className="mr-4"
//               onClick={() => openActionModal('resetPassword', record, companyData.company_uuid)}
//             >
//               Reset Password
//             </Button>

//             {!companyData?.is_admin && record.email !== user?.email && (
//               <Button
//                 danger
//                 onClick={() => openActionModal('delete', record, companyData.company_uuid)}
//               >
//                 Remove User
//               </Button>
//             )}
//           </div>
//         );
//       }
//     }
//   ];

//   const companyColumns = [
//     { title: 'ID', dataIndex: 'uuid', key: 'uuid' },
//     { title: 'Company Name', dataIndex: 'name', key: 'name' }
//   ];

//   const rolesColumns = [
//     { title: 'ID', dataIndex: 'id', key: 'id' },
//     { title: 'Firstname', dataIndex: 'first_name', key: 'first_name' },
//     { title: 'Lastname', dataIndex: 'last_name', key: 'last_name' },
//     { title: 'Admin', dataIndex: 'is_admin', key: 'is_admin' },
//     { title: 'Email', dataIndex: 'email', key: 'email' },
//     {
//       title: 'Actions',
//       render: (_text, record) => {
//         const companyData = record.companies.find(
//           (company) => company.company_uuid === selectedCompany
//         );
//         return (
//           <div>
//             {!companyData?.is_admin && (
//               <Button
//                 onClick={() => openActionModal('makeAdmin', record, companyData.company_uuid)}
//               >
//                 Make Admin
//               </Button>
//             )}
//             {companyData?.is_admin && (
//               <Button
//                 danger
//                 onClick={() => openActionModal('removeAdmin', record, companyData.company_uuid)}
//               >
//                 Remove As Admin
//               </Button>
//             )}
//           </div>
//         );
//       }
//     }
//   ];

//   const items = [
//     {
//       key: '1',
//       label: <h2 className="text-lg">User Management</h2>,
//       children: (
//         <div>
//           <div className="justify-between items-center mb-8 flex">
//             <h2 className="text-3xl">Users Management</h2>
//             <div className="space-x-4">
//               <Button
//                 onClick={() => setIsUserModalOpen(true)}
//                 type="primary"
//                 disabled={!selectedCompany}
//               >
//                 Add User
//               </Button>
//               <Button onClick={() => setIsCompanyModalOpen(true)} type="primary">
//                 Create Company
//               </Button>
//               <Button
//                 onClick={() => {
//                   window.location.href = '/admin-signup';
//                 }}
//                 type="primary"
//               >
//                 Admin SignUp
//               </Button>
//             </div>
//           </div>
//           {userData.length > 0 ? (
//             <Table
//               dataSource={userData}
//               columns={columns}
//               pagination={{ pageSize: 10 }}
//               rowKey="id"
//             />
//           ) : (
//             <p>No users available for this company.</p>
//           )}
//         </div>
//       )
//     },
//     {
//       key: '2',
//       label: <h2 className="text-lg">Manage Companies</h2>,
//       children: (
//         <div>
//           <div className="justify-between items-center mb-8 flex">
//             <h2 className="text-3xl">Companies Management</h2>
//           </div>
//           {companies.length > 0 ? (
//             <Table
//               dataSource={companies}
//               columns={companyColumns}
//               pagination={{ pageSize: 10 }}
//               rowKey="id"
//             />
//           ) : (
//             <p>No Companies available</p>
//           )}
//         </div>
//       )
//     },
//     {
//       key: '3',
//       label: <h2 className="text-lg">Assign Roles to users</h2>,
//       children: (
//         <div>
//           <div className="justify-between items-center mb-8 flex">
//             <h2 className="text-3xl">Role Management</h2>
//           </div>
//           {userData.length > 0 ? (
//             <Table
//               dataSource={userData}
//               columns={rolesColumns}
//               pagination={{ pageSize: 10 }}
//               rowKey="id"
//             />
//           ) : (
//             <p>No users available for this company.</p>
//           )}
//         </div>
//       )
//     }
//   ];

//   return (
//     <MainLayout>
//       <Layout>
//         <Content>
//           <div className="mx-4">
//             <Tabs defaultActiveKey="1" items={items} />
//           </div>
//         </Content>
//         <MainFooter />
//         {isUserModalOpen && (
//           <UserModel
//             onCancel={() => setIsUserModalOpen(false)}
//             selectedCompany={selectedCompany}
//             onSuccess={handleUserModalSuccess}
//           />
//         )}
//         {isCompanyModalOpen && (
//           <CompanyModel
//             onCancel={() => setIsCompanyModalOpen(false)}
//             onSuccess={handleCompanyModalSuccess}
//           />
//         )}

//         <ActionConfirmModal
//           visible={modalInfo.visible}
//           onCancel={() => setModalInfo({ ...modalInfo, visible: false })}
//           onConfirm={handleModalConfirm}
//           action={modalInfo.action}
//           email={modalInfo.user?.email}
//           firstName={modalInfo.user?.first_name}
//           lastName={modalInfo.user?.last_name}
//         />
//       </Layout>
//     </MainLayout>
//   );
// };

// export default OrganisationManagement;
import React from 'react';

const Index = () => (
  <div>Index</div>
);

export default Index;
