/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import { faAngleRight } from '@fortawesome/pro-regular-svg-icons';
import { faBell } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Badge, Dropdown, Select, Space } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import qs from 'qs';
import { useContext } from 'react';
// import { Button } from 'rsuite';
// import useSWR, { useSWRConfig } from 'swr';
// import { apiList, apiPut } from 'services/api';
import { userContext } from 'contexts/Auth';
import { PermissionsContext } from 'contexts/Permissions';

// const parse = require('html-react-parser');

const Navbar = () => {
  const {
    // eslint-disable-next-line max-len
    logout,
    user,
    mounted,
    companies,
    handleCompanyChange,
    selectedCompany,
    setPagination,
    pagination
  } = useContext(userContext);

  const { refreshPermissions } = useContext(PermissionsContext);

  const router = useRouter();

  const menu = [
    { label: 'My Capabara', href: '/mycapabara' },
    ...(user?.email
      ? [
        { label: 'Users', href: '/users' },
        { label: 'Company', href: '/company' },
        { label: 'Billing', href: '/billing' }
      ]
      : [])
  ];

  // const [notifOpen, setNotifOpen] = useState(false);
  // const [ntype, setNtype] = useState('unread');
  // const { mutate } = useSWRConfig();

  // const notifsQuery = useSWR('notifs', () => apiList('/notifications/', '', authToken));

  // let unreadNotifs = [];
  // let readNotifs = [];
  // if (notifsQuery.data) {
  //   const notifs = notifsQuery.data;
  //   unreadNotifs = notifs.filter((n) => n.read === false);
  //   readNotifs = notifs.filter((n) => n.read === true);
  // }

  const items = [
    {
      key: '1',
      label: (
        <div style={{ minWidth: 100 }}>
          <Link href="/my-account" className="text-mainText">
            My Account
          </Link>
        </div>
      )
    },
    {
      key: '2',
      label: (
        <div style={{ minWidth: 100 }}>
          <button className="text-mainText" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      ),
      disabled: true
    }
  ];

  const currPath = (path) => router.asPath.includes(path);

  // const navNotif = async (notif) => {
  //   if (!notif.read) {
  //     mutate(
  //       'notifs',
  //       async (notifs) => {
  //         const values = {
  //           read: true,
  //           text: notif.text,
  //           user: notif.user
  //         };
  //         await apiPut(`/notifications/${notif.uuid}/`, values, authToken);
  //         return notifs.map((n) => (n.uuid === notif.uuid ? { ...n, read: true } : n));
  //       },
  //       { revalidate: false }
  //     );
  //   }

  //   let url = '';
  //   if (notif.url === 'all-capabilities') {
  //     url = `/capabilities?${qs.stringify(notif.url_kwargs)}`;
  //   } else {
  //     const { obj, get } = notif.url_kwargs;
  //     url = `/capabilities/${obj}?${qs.stringify(get)}`;
  //   }

  //   router.push(url);
  //   setNotifOpen(false);
  // };

  // const notifItems = [
  //   {
  //     key: 'unread',
  //     label: <Badge count={unreadNotifs.length}>Unread</Badge>,
  //     children: (
  //       <List
  //         header={null}
  //         footer={null}
  //         bordered={false}
  //         dataSource={unreadNotifs}
  //         renderItem={(item) => (
  //           <List.Item>
  //             <div className="flex items-center justify-between">
  //               <div className="mr-4">{parse(item.text)}</div>
  //               <Button onClick={() => navNotif(item)}>
  //                 <FontAwesomeIcon icon={faAngleRight} />
  //               </Button>
  //             </div>
  //           </List.Item>
  //         )}
  //       />
  //     )
  //   },
  //   {
  //     key: 'read',
  //     label: 'Read',
  //     children: (
  //       <List
  //         header={null}
  //         footer={null}
  //         bordered={false}
  //         dataSource={readNotifs}
  //         renderItem={(item) => (
  //           <List.Item>
  //             <div className="flex items-center justify-between">
  //               <div className="mr-4">{parse(item.text)}</div>
  //               <Button onClick={() => navNotif(item)}>
  //                 <FontAwesomeIcon icon={faAngleRight} />
  //               </Button>
  //             </div>
  //           </List.Item>
  //         )}
  //       />
  //     )
  //   }
  // ];

  const onCompanyChange = async (value) => {
    await handleCompanyChange(value);
    refreshPermissions();
  };

  return (
    <>
      <nav className="bg-white shadow z-[11]">
        <div className="px-4">
          <div className="relative flex h-16 justify-between">
            <div className="flex flex-1 items-center justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img src="/TM_CapabaraLogo-210622-SecondaryLogo.png" className="h-7" alt="" />
              </div>
              <div className="ml-12 flex space-x-8 py-2">
                {menu.map((item) => (
                  <div
                    className={`inline-flex items-center border-b-[3px] px-1 pt-1 ${
                      currPath(item.href)
                        ? 'text-primary  border-primary'
                        : ':hover-lightText border-white'
                    }`}
                    key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 cursor-pointer">
              <Select
                className="w-[300px] right-2"
                value={selectedCompany}
                onChange={(e) => onCompanyChange(e)}
                options={companies.map((company) => ({
                  value: company.uuid,
                  label: company.name
                }))}
                placeholder="Please select a company"
                onPopupScroll={() => {
                  // On the scroll of the dropdown, set the pagination to the next page or
                  //  reset to the first page
                  if (pagination.current < pagination.totalPages) {
                    let throttleTimeout = null;

                    if (!throttleTimeout) {
                      throttleTimeout = setTimeout(() => {
                        setPagination({
                          ...pagination,
                          current: pagination.current + 1
                        });
                        throttleTimeout = null;
                      }, 1000); // Adjust the delay as needed
                    }
                  }
                }}
              />
              <Space>
                <Badge count={0}>
                  <Avatar
                    icon={<FontAwesomeIcon icon={faBell} />}
                    // onClick={() => setNotifOpen(true)}
                  />
                </Badge>
                {mounted ? (
                  <Dropdown placement="bottom" menu={{ items }} key="user" trigger={['click']}>
                    <Avatar>{user.two_letters}</Avatar>
                  </Dropdown>
                ) : null}
              </Space>
            </div>
          </div>
        </div>
      </nav>
      {/* <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setNotifOpen(false)}
        open={notifOpen}
        width={500}
      >
        <Tabs activeKey={ntype} items={notifItems} onChange={setNtype} />
      </Drawer> */}
    </>
  );
};

export default Navbar;
