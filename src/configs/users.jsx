/* eslint-disable no-unused-vars */
import { faPencil } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Switch } from 'antd';
import FormInstruction from 'components/FormInstruction';
import UserAvatar from 'components/old/UserAvatar';

const userColumns = () => [
  {
    title: '',
    dataIndex: 'first_name',
    width: 40,
    render: (_, item) => (
      <UserAvatar
        user={item}
      />
    )
  },
  {
    title: 'First Name',
    dataIndex: 'first_name'
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name'
  },
  {
    title: 'Display Name',
    dataIndex: 'display_name',
    render: (_, item) => item.profile.display_name
  },
  {
    title: 'Email',
    dataIndex: 'email'
  },
  {
    title: 'Actions',
    width: 40,
    dataIndex: 'actions',
    align: 'center',
    render: (_, item) => (
      <Button type="dashed">
        <FontAwesomeIcon icon={faPencil} />
      </Button>
    )
  }
];

const userMetas = {
  columns: 1,
  formItemLayout: [6, 18],
  fields: [
    {
      key: 'help',
      label: null,
      widget: FormInstruction,
      widgetProps: {
        text: ["Add entities to build your company's organizational structure"],
        span: [6, 18]
      }
    },
    {
      key: 'email',
      label: 'Email',
      required: true
    },
    {
      key: 'first_name',
      label: 'First Name',
      required: true
    },
    {
      key: 'last_name',
      label: 'Last Name'
    },
    {
      key: 'display_name',
      label: 'Display Name',
      required: true
    }
  ]
};

export { userColumns, userMetas };
