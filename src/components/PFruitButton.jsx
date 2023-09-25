import { faQuestion } from '@fortawesome/pro-regular-svg-icons';
import { faCircleQuestion } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { PropTypes } from 'prop-types';

const tourPages = [
  { route: '/capabilities', id: 'objectives_page_help' },
  { route: '/capabilities/[ouuid]', id: 'capabilities_page_help' },
  { route: '/departments', id: 'departments_page_help' },
  { route: '/users', id: 'users_page_help' },
  { route: '/records', id: 'records_page_help' },
  { route: '/records/[...action]', id: 'add_new_records_page_help' },
  { route: '/marketplace', id: 'marketplace_page_help' }
];

const PFruitButton = (props) => {
  const { isPage, tourModal, tourDrawer } = props;

  const router = useRouter();
  const { route } = router;

  const getTourPage = (path) => {
    const page = tourPages.filter((tour) => tour.route === path)[0] ?? { id: '' };
    return page.id;
  };

  return (
    <>
      {route !== '/' && (
        <Tooltip title="Help tours">
          {isPage ? (
            <div className="fixed bottom-4 right-4 z-50 drop-shadow-md">
              <Button
                id={route !== '/' && getTourPage(route)}
                type="primary"
                shape="circle"
                size="large"
                icon={<FontAwesomeIcon className="text-white" icon={faQuestion} />}
              />
            </div>
          ) : (
            <Button
              id={tourModal !== '' ? tourModal : tourDrawer}
              shape="circle"
              className={`!border-0 !shadow-none !absolute right-10 ${tourDrawer ? 'top-6' : 'top-4'}`}
              icon={<FontAwesomeIcon className="text-primary" icon={faCircleQuestion} />}
            />
          )}
        </Tooltip>
      )}
    </>
  );
};

PFruitButton.propTypes = {
  isPage: PropTypes.bool,
  tourModal: PropTypes.string,
  tourDrawer: PropTypes.string
};

PFruitButton.defaultProps = {
  isPage: false,
  tourModal: '',
  tourDrawer: ''
};

export default PFruitButton;
