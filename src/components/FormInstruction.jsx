import { Col, Row } from 'antd';
import PropTypes from 'prop-types';

const FormInstruction = ({
  text, span
}) => (
  <Row>
    <Col span={span[0]} />
    <Col span={span[1]}>
      {text}
    </Col>
  </Row>

);

FormInstruction.propTypes = {
  text: PropTypes.instanceOf(Array).isRequired,
  span: PropTypes.instanceOf(Array).isRequired
};

export default FormInstruction;
