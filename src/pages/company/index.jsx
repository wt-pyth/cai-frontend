/* eslint-disable max-len */
import React, {
  useState, useContext, useEffect, useCallback
} from 'react';
import { toast } from 'react-toastify';
import {
  Layout, Table, Button, Spin
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faPencil, faTrash
} from '@fortawesome/pro-solid-svg-icons';
import toastError from 'utils/toastErrors';
import MainFooter from 'components/layouts/MainFooter';
import Navbar from 'components/layouts/Navbar';
import { userContext } from 'contexts/Auth';
import { CompanyModel, ActionConfirmModal } from 'utils/popUpModals';
import SecondaryHeader from 'components/secondaryNav';

const { Content } = Layout;

const Company = () => {
  const {
    apiClient,
    companies,
    fetchCompanies,
    pagination,
    setPagination,
    searchText,
    setSearchText
  } = useContext(userContext);

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState(searchText);

  // Memoized fetch function to prevent unnecessary rerenders
  const fetchCompaniesData = useCallback((page = pagination.current, search = searchText, pageSize = pagination.pageSize) => {
    setIsLoading(true);
    return fetchCompanies(page, search, pageSize)
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCompanies, pagination.pageSize, searchText]);

  // Fetch companies when pagination changes
  useEffect(() => {
    fetchCompaniesData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, fetchCompaniesData]);

  // Handle search with debounce
  // Handle search with debounce
  const debouncedSearch = useCallback((value) => {
    if (value !== searchText) {
      setSearchText(value);
      if (pagination.current === 1) {
        fetchCompaniesData(1, value);
      } else {
        setPagination((prev) => ({ ...prev, current: 1 }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, pagination, setPagination, fetchCompaniesData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchValue);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, debouncedSearch]);

  // Trigger the delete modal
  const openDeleteModal = useCallback((record) => {
    setCompanyToDelete(record);
    setDeleteModalOpen(true);
  }, []);

  // Handle company modal
  const openCompanyModal = useCallback((company = null) => {
    setEditingCompany(company);
    setIsCompanyModalOpen(true);
  }, []);

  const closeCompanyModal = useCallback(() => {
    setIsCompanyModalOpen(false);
    setEditingCompany(null);
  }, []);

  // Handle company deletion
  const handleDeleteConfirm = useCallback(async () => {
    if (!companyToDelete?.uuid) return;

    try {
      const res = await apiClient.delete(`api/auth/companies/${companyToDelete.uuid}/`);
      if (res.status === 200) {
        toast.success('Company deleted successfully');
      } else {
        toast.error('Error deleting company');
      }
    } catch (error) {
      toastError('Error deleting company');
    } finally {
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
      fetchCompaniesData();
    }
  }, [apiClient, companyToDelete, fetchCompaniesData]);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setCompanyToDelete(null);
  }, []);

  // Table columns for listing companies
  const columns = [
    {
      title: 'Company Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isDefaultOrg = record.name?.toLowerCase() === 'default-organisation'.toLowerCase();

        if (isDefaultOrg) return null;

        return (
          <div className="flex space-x-2">
            <Button
              type="text"
              icon={<FontAwesomeIcon icon={faPencil} />}
              onClick={() => openCompanyModal(record)}
              title="Edit Company"
            />
            <Button
              type="text"
              icon={<FontAwesomeIcon icon={faTrash} />}
              onClick={() => openDeleteModal(record)}
              title="Delete Company"
              danger
            />
          </div>
        );
      }
    }
  ];

  // Handle table pagination change
  const handleTableChange = useCallback((paginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize
    }));
  }, [setPagination]);

  // Custom config for company deletion modal
  const deleteModalConfig = {
    title: 'Delete',
    message: 'All associated records will be permanently deleted this option CANNOT be undone',
    button: 'Delete',
    danger: true,
    icon: <FontAwesomeIcon icon={faTrash} className="mr-2" />
  };

  return (
    <Layout className="layout h-screen">
      <Navbar />
      <Content className="bg-gray-100">
        <div className="mx-auto">
          <div className="bg-darkBlueText h-[48px]">
            <SecondaryHeader
              title="Company"
              icon={faBuilding}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              debouncedSearch={debouncedSearch}
              onAdd={() => openCompanyModal()}
              addButtonText="Add Company"
            />
            <Spin spinning={isLoading} tip="Loading companies...">
              <Table
                dataSource={companies}
                rowKey="uuid"
                columns={columns}
                pagination={{
                  ...pagination,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '25', '50', '100'],
                  itemRender: (page, type, originalElement) => {
                    if (type === 'prev') return <Button icon={<LeftOutlined />} size="small" />;
                    if (type === 'next') return <Button icon={<RightOutlined />} size="small" />;
                    return originalElement;
                  }
                }}
                onChange={handleTableChange}
              />
            </Spin>
          </div>
        </div>
      </Content>
      <MainFooter />

      {isCompanyModalOpen && (
        <CompanyModel
          onCancel={closeCompanyModal}
          onSuccess={() => {
            closeCompanyModal();
            fetchCompaniesData();
          }}
          companyData={editingCompany}
          setDeleteModalOpen={setDeleteModalOpen}
          setCompanyToDelete={setCompanyToDelete}
        />
      )}

      {deleteModalOpen && companyToDelete && (
        <ActionConfirmModal
          visible={deleteModalOpen}
          onCancel={closeDeleteModal}
          onConfirm={handleDeleteConfirm}
          modalConfig={deleteModalConfig}
          firstName={companyToDelete.name}
          email=""
          lastName=""
        />
      )}
    </Layout>
  );
};

export default Company;
