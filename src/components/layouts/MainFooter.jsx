import {
  Layout, Typography
} from 'antd';

const { Footer } = Layout;
const { Text } = Typography;

const year = new Date().getFullYear();

const MainFooter = () => (
  <Footer
    style={{ textAlign: 'center' }}
  >
    <Text
      className="mr-2"
      strong
    >
      CAPABARA Knowledge System ©
      {year}
    </Text>
    Created by Straits Interactive Pte Ltd
  </Footer>
);

export default MainFooter;
