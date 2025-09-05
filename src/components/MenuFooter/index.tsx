import { Col, Row } from 'antd';
import footerIcon from '../../../public/icons/footer.png';

const MenuFooter = () => {
  return (
    <Row style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <img
        src={footerIcon}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Row>
  );
};

export default MenuFooter;
