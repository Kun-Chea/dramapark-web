import { getCaptchaImg, login } from '@/services/system/auth';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message, Image, Row, Col, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { clearSessionToken, setSessionToken } from '@/access';

const THEME_COLOR = '#F3AE4A';

const Lang = () => {
  const langClassName = useEmotionCss(({ token }) => {
    return {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      top: 16,
      borderRadius: token.borderRadius,
      background: 'rgba(255,255,255,0.7)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      zIndex: 10,
      ':hover': {
        backgroundColor: '#fffbe6',
      },
    };
  });

  return (
    <div className={langClassName} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
        borderRadius: 6,
        border: `1px solid ${THEME_COLOR}`,
        background: '#fff7e6',
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({ code: 200 });
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [captchaCode, setCaptchaCode] = useState<string>('');
  const [uuid, setUuid] = useState<string>('');

  // 背景渐变+主题色
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      overflow: 'hidden', // 这里改为hidden，防止出现滚动条
      background: `linear-gradient(135deg, #fffbe6 0%, #fff 60%, ${THEME_COLOR}22 100%)`,
      alignItems: 'center',
      justifyContent: 'center',
    };
  });

  // 登录卡片样式
  const cardClassName = useEmotionCss(() => {
    return {
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 8px 32px 0 rgba(243,174,74,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)',
      padding: '48px 36px 32px 36px',
      margin: '0 auto',
      position: 'relative',
      border: `1.5px solid ${THEME_COLOR}33`,
    };
  });

  // 标题样式
  const titleClassName = useEmotionCss(() => {
    return {
      textAlign: 'center',
      fontWeight: 700,
      fontSize: 32,
      color: THEME_COLOR,
      marginBottom: 8,
      letterSpacing: 2,
      fontFamily: 'Futura, "PingFang SC", "Microsoft YaHei", Arial, sans-serif',
    };
  });

  // 副标题样式
  const subtitleClassName = useEmotionCss(() => {
    return {
      textAlign: 'center',
      color: '#888',
      fontSize: 16,
      marginBottom: 32,
      letterSpacing: 1,
    };
  });

  const intl = useIntl();

  const getCaptchaCode = async () => {
    const response = await getCaptchaImg();
    const imgdata = `data:image/png;base64,${response.img}`;
    setCaptchaCode(imgdata);
    setUuid(response.uuid);
  };

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const response = await login({ ...values, uuid });
      if (response.code === 200) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        const current = new Date();
        const expireTime = current.setTime(current.getTime() + 1000 * 12 * 60 * 60);
        setSessionToken(response?.token, response?.token, expireTime);
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        clearSessionToken();
        setUserLoginState({ ...response, type });
        getCaptchaCode();
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  const { code } = userLoginState;
  const loginType = type;

  useEffect(() => {
    getCaptchaCode();
  }, []);

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>{Settings.title}</title>
      </Helmet>
      <Lang />
      <div className={cardClassName}>
        <div className={titleClassName}>DramPark</div>
        <div className={subtitleClassName}>
          {intl.formatMessage({
            id: 'pages.login.welcome',
            defaultMessage: '欢迎登录 DramPark 管理后台',
          })}
        </div>
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '100%',
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            height: '100%',
          }}
          submitter={{
            searchConfig: {
              submitText: intl.formatMessage({
                id: 'pages.login.submit',
                defaultMessage: '登录',
              }),
            },
            // 这里不需要自定义render，否则会导致按钮渲染异常
            // render: (props, doms) => <div style={{ marginTop: 8 }}>{doms}</div>,
            submitButtonProps: {
              style: {
                width: '100%',
                background: THEME_COLOR,
                borderColor: THEME_COLOR,
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 8,
                height: 44,
                boxShadow: `0 2px 8px 0 ${THEME_COLOR}33`,
                marginTop: 8,
              },
            },
          }}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {code !== 200 && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/admin123)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                initialValue="admin"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined style={{ color: THEME_COLOR }} />,
                  style: {
                    borderRadius: 8,
                  },
                  autoComplete: 'username',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                initialValue="admin123"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined style={{ color: THEME_COLOR }} />,
                  style: {
                    borderRadius: 8,
                  },
                  autoComplete: 'current-password',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: admin123',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              <Row>
                <Col flex={3}>
                  <ProFormText
                    style={{
                      float: 'right',
                    }}
                    name="code"
                    placeholder={intl.formatMessage({
                      id: 'pages.login.captcha.placeholder',
                      defaultMessage: '请输入验证',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.updateForm.ruleName.nameRules"
                            defaultMessage="请输入验证啊"
                          />
                        ),
                      },
                    ]}
                  />
                </Col>
                <Col flex={2}>
                  <Image
                    src={captchaCode}
                    alt="验证码"
                    style={{
                      display: 'inline-block',
                      verticalAlign: 'top',
                      cursor: 'pointer',
                      paddingLeft: '10px',
                      width: '100px',
                    }}
                    preview={false}
                    onClick={() => getCaptchaCode()}
                  />
                </Col>
              </Row>
            </>
          )}

          {code !== 200 && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined style={{ color: THEME_COLOR }} />,
                  style: { borderRadius: 8 },
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined style={{ color: THEME_COLOR }} />,
                  style: { borderRadius: 8 },
                }}
                captchaProps={{
                  size: 'large',
                  style: { borderRadius: 8 },
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (!result) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 8,
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                color: THEME_COLOR,
                fontWeight: 500,
                fontSize: 14,
                textDecoration: 'none',
              }}
              href="#"
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
