/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from 'antd';
import PropTypes from 'prop-types';

const UserAvatar = ({
  user, handleClick
}) => (
  <Avatar
    style={{ backgroundColor: user.color, verticalAlign: 'middle' }}
    gap={4}
    size="small"
    onClick={handleClick}
  >
    {user.two_letters}
  </Avatar>
);

UserAvatar.propTypes = {
  user: PropTypes.instanceOf(Object).isRequired,
  handleClick: PropTypes.func
};

UserAvatar.defaultProps = {
  handleClick: () => {}
};

export default UserAvatar;
