/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-globals */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-lonely-if */
/* eslint-disable max-len */
import {
  Layout, Card, Badge, Row, Divider
} from 'antd';
import styles from './mycapabara.module.css';
import MainFooter from 'components/layouts/MainFooter';
import Navbar from 'components/layouts/Navbar';

const { Content } = Layout;

export default function MyCapabara() {
  return (
    <Layout className="layout h-screen">
      <Navbar />
      <Content>

        <div className={styles.container}>

          <Divider orientation="middle" style={{ borderColor: '#F07C28', color: '#F07C28', fontSize: 14 }}>Capability-as-a-Service</Divider>

          <div className={styles.appCardContainer}>
            <Row type="flex" className={styles.appRow}>
              <Badge.Ribbon text="Develop" color="#0C4A6E">
                <a href="https://develop.capabara.com">
                  <Card className={styles.appCard}>
                    <img className={styles.appImage} src="./CapabaraR-AIAssistantPrimary.png" alt="Capability develop" />
                  </Card>
                </a>
              </Badge.Ribbon>
              <Badge.Ribbon text="Govern" color="#0C4A6E">
                <a href="https://govern.capabara.com">
                  <Card className={styles.appCard}>
                    <img className={styles.appImage} src="./CapabaraR-KnowledgeSystemPrimary.png" alt="Capability govern" />
                  </Card>
                </a>
              </Badge.Ribbon>
              <Badge.Ribbon text="Manage" color="#0C4A6E">
                <a href="https://manage.capabara.com">
                  <Card className={styles.appCard}>
                    <img className={styles.appImage} src="./CapabaraR-CapabilityManagementPrimary.png" alt="Capability manage" />
                  </Card>
                </a>
              </Badge.Ribbon>
            </Row>
          </div>

          <div className={styles.advertContainer}>
            <Row type="flex">
              <Card className={styles.advertCard}>
                <img className={styles.advertImage} src="./platform_test_animation_3b.gif" alt="rolling advert" />
              </Card>
            </Row>
          </div>

          <Divider orientation="middle" style={{ borderColor: '#F07C28', color: '#F07C28', fontSize: 14 }}>Data Protection and Governance</Divider>

          <div className={styles.courseContainer}>
            <Row type="flex" className={styles.courseRow}>

              <a href="https://dpoinbox.genexist.com/">
                <Card cover={<img src="./dpoinbox.png" alt="DPOinBox Logo" />} className={styles.courseCard}>
                  DPOinBox
                </Card>
              </a>

              <a href="https://www.dpexnetwork.org/courses">
                <Card cover={<img src="./6264aa943c33126392a9aeb2331077e5.webp" alt="Course details" />} className={styles.courseCard}>
                  Certified AI Business Professional
                </Card>
              </a>

              <a href="https://www.dpexnetwork.org/courses">
                <Card cover={<img src="./d3be769196df5b139926bf0f69448b27.webp" alt="Course details" />} className={styles.courseCard}>
                  Practical Approach to Generative AI
                </Card>
              </a>

              <a href="https://www.dpexnetwork.org/courses">
                <Card cover={<img src="./Dx8vGRM4Eco9kLwYwBE2cA.png" alt="Course details" />} className={styles.courseCard}>
                  Conversational AI and Prompt Techniques
                </Card>
              </a>

              <a href="https://www.dpexnetwork.org/courses">
                <Card cover={<img src="./cu5DFACrgq3rJkDxHVJ6jt.png" alt="Course details" />} className={styles.courseCard}>
                  Applications of Generative AI and Business Productivity
                </Card>
              </a>

              <a href="https://www.dpexnetwork.org/courses">
                <Card cover={<img src="./7PTKskh9b67KAXFC7eUqmG.png" alt="Course details" />} className={styles.courseCard}>
                  Data Ethics and AI Governance Frameworks
                </Card>
              </a>

            </Row>
          </div>

        </div>
      </Content>
      <MainFooter />
    </Layout>
  );
}
