import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const THEME_COLOR = '#F3AE4A';

const Footer: React.FC = () => (
  <AntFooter
    style={{
      width: '100%',
      padding: '16px 0',
      textAlign: 'center',
      color: '#333',
      fontSize: 15,
      marginTop: 40,
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 18, color: THEME_COLOR, marginBottom: 4 }}>
      DramRoom 短剧后台管理系统
    </div>
    <Text style={{ color: '#aaa', fontSize: 13 }}>
      © {new Date().getFullYear()} DramRoom. 保留所有权利.
    </Text>
  </AntFooter>
);

export default Footer;
