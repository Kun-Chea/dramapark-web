import React, { useCallback } from 'react';
import { SelectLang } from '@/components';
import back from '../../../public/icons/rbk.png';
import { Avatar, Col, Dropdown, Row, Space, Switch, Tooltip, Typography } from 'antd';
import { BulbOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { flushSync } from 'react-dom';
import { history, useModel } from '@umijs/max';
import { stringify } from 'querystring';
import { clearSessionToken } from '@/access';
import { setRemoteMenu } from '@/services/session';
import { logout } from '@/services/system/auth';

const HeaderRight: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { themeColor, setThemeColor } = useModel('configModel');
  const { currentUser } = initialState || {};

  const menuItems = [
    {
      key: 'center',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '个人设置',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    await logout();
    clearSessionToken();
    setRemoteMenu(null);
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const onMenuClick = useCallback((event: any) => {
    const { key } = event;
    console.log('key', key);
    if (key === 'logout') {
      flushSync(() => {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
      });
      loginOut();
      return;
    }
    history.push(`/account/${key}`);
  }, []);

  // 切换主题
  const handleThemeSwitch = (checked: boolean) => {
    setThemeColor(checked ? 'realDark' : 'light');
  };

  return (
    <Row>
      <Col span={4} />
      <Col span={20}>
        <Row
          justify="end"
          align="middle"
          style={{
            paddingRight: 50,
            backgroundImage: `url(${back})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '300px',
            alignItems: 'center',
            height: '100%',
            gap: 30,
          }}
        >
          <Space size="middle">
            <SelectLang />
            <Row align="middle">
              <Tooltip
                title={
                  themeColor === 'realDark'
                    ? '切换为明亮主题'
                    : '切换为深色主题'
                }
              >
                <Switch
                  checkedChildren={<BulbOutlined />}
                  unCheckedChildren={<BulbOutlined />}
                  checked={themeColor === 'realDark'}
                  onChange={handleThemeSwitch}
                  style={{
                    backgroundColor: themeColor === 'realDark' ? '#222' : '#ffd666',
                  }}
                />
              </Tooltip>
            </Row>

            <Dropdown menu={{ items: menuItems, onClick: onMenuClick }} placement="bottomRight">
              <Row align="middle" className="cursor-pointer">
                <Avatar
                  icon={<UserOutlined />}
                  src={currentUser?.avatar}
                  style={{ marginRight: 10 }}
                />
                <Typography.Text className="ml-2">
                  {currentUser?.nickName || '用户'}
                </Typography.Text>
              </Row>
            </Dropdown>
          </Space>
        </Row>
      </Col>
    </Row>
  );
};

export default HeaderRight;
