/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { faAngleRight } from '@fortawesome/pro-regular-svg-icons';
import { faBell } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Avatar, Badge, Drawer, Dropdown, List,
  Space, Tabs
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import qs from 'qs';
import { useContext, useState } from 'react';
import { Button } from 'rsuite';
import useSWR, { useSWRConfig } from 'swr';
import { apiList, apiPut } from 'services/api';
import { userContext } from 'contexts/Auth';

const parse = require('html-react-parser');

const menu = [
  { label: 'My Knowledge', href: '/myknowledge' },
  { label: 'AI DPO', href: '/aiassistant' }
];

const Navbar = () => {
  const {
    logout, user, authToken, mounted
  } = useContext(userContext);
  const router = useRouter();

  const [notifOpen, setNotifOpen] = useState(false);
  const [ntype, setNtype] = useState('unread');
  const { mutate } = useSWRConfig();

  const notifsQuery = useSWR(
    'notifs', () => apiList('/notifications/', '', authToken)
  );

  let unreadNotifs = [];
  let readNotifs = [];
  if (notifsQuery.data) {
    const notifs = notifsQuery.data;
    unreadNotifs = notifs.filter((n) => n.read === false);
    readNotifs = notifs.filter((n) => n.read === true);
  }

  const items = [
    {
      key: '1',
      label: (
        <div
          style={{ minWidth: 100 }}
        >
          <button
            className="text-mainText"
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ),
      disabled: true
    }
  ];

  const currPath = (path) => router.asPath.includes(path);

  const navNotif = async (notif) => {
    if (!notif.read) {
      mutate(
        'notifs',
        async (notifs) => {
          const values = {
            read: true,
            text: notif.text,
            user: notif.user
          };
          await apiPut(`/notifications/${notif.uuid}/`, values, authToken);
          return notifs.map((n) => (
            n.uuid === notif.uuid ? { ...n, read: true } : n));
        },
        { revalidate: false }
      );
    }

    let url = '';
    if (notif.url === 'all-capabilities') {
      url = `/capabilities?${qs.stringify(notif.url_kwargs)}`;
    } else {
      const { obj, get } = notif.url_kwargs;
      url = `/capabilities/${obj}?${qs.stringify(get)}`;
    }

    router.push(url);
    setNotifOpen(false);
  };

  const notifItems = [
    {
      key: 'unread',
      label: <Badge count={unreadNotifs.length}>Unread</Badge>,
      children: (
        <List
          header={null}
          footer={null}
          bordered={false}
          dataSource={unreadNotifs}
          renderItem={(item) => (
            <List.Item>
              <div className="flex items-center justify-between">
                <div className="mr-4">{parse(item.text)}</div>
                <Button onClick={() => navNotif(item)}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </Button>
              </div>
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'read',
      label: 'Read',
      children: (
        (
          <List
            header={null}
            footer={null}
            bordered={false}
            dataSource={readNotifs}
            renderItem={(item) => (
              <List.Item>
                <div className="flex items-center justify-between">
                  <div className="mr-4">{parse(item.text)}</div>
                  <Button onClick={() => navNotif(item)}>
                    <FontAwesomeIcon icon={faAngleRight} />
                  </Button>
                </div>
              </List.Item>
            )}
          />
        )
      )
    }
  ];

  return (
    <>
      <nav className="bg-white shadow z-[11]">
        <div className="px-4">
          <div className="relative flex h-16 justify-between">
            <div className="flex flex-1 items-center justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img src="/CapabaraR-KnowledgeSystemSecondary.png" className="h-10" alt="" />
              </div>
              <div className="ml-12 flex space-x-8 py-2">
                {menu.map((item) => (
                  <div
                    className={`inline-flex items-center border-b-[3px] px-1 pt-1 ${currPath(item.href) ? 'text-primary  border-primary' : ':hover-lightText border-white'}`}
                    key={item.href}
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 cursor-pointer">
              <Space>
                <Badge count={unreadNotifs.length}>
                  <Avatar
                    icon={<FontAwesomeIcon icon={faBell} />}
                    onClick={() => setNotifOpen(true)}
                  />
                </Badge>
                {mounted
                  ? (
                    <Dropdown placement="bottom" menu={{ items }} key="user" trigger={['click']}>
                      <Avatar>
                        {user.two_letters}
                      </Avatar>
                    </Dropdown>
                  )
                  : null}
              </Space>
            </div>
          </div>
        </div>

      </nav>
      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setNotifOpen(false)}
        open={notifOpen}
        width={500}
      >
        <Tabs activeKey={ntype} items={notifItems} onChange={setNtype} />
      </Drawer>
    </>
  );
};

export default Navbar;
