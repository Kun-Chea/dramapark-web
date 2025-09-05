import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, useModel } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import { clearSessionToken, getAccessToken } from './access';
import {
  getRoutersInfo,
  getUserInfo,
} from './services/session';
import { PageEnum } from './enums/pagesEnums';
import logo from '../public/icons/app.png';
import HeaderRight from './components/HeaderRight';
import MenuFooter from './components/MenuFooter';
import { useEffect } from 'react';
import Footer from './components/Footer';
import { message } from 'antd';
const isDev = process.env.NODE_ENV === 'development';
console.warn = () => {};
console.error = () => {};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const response = await getUserInfo({
        skipErrorHandler: true,
      });
      if (!response.user.avatar) {
        response.user.avatar =
          'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      }
      return {
        ...response.user,
        permissions: response.permissions,
        roles: response.roles,
      } as API.CurrentUser;
    } catch (error) {
      console.log(error);
      history.push(PageEnum.LOGIN);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== PageEnum.LOGIN) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }: any) => {
  const { themeColor } = useModel('configModel');
  useEffect(() => {
    console.log('themeColor', themeColor);
  }, [themeColor]);
  console.log('initialState', initialState);

  return {
    logo,
    rightRender: () => <HeaderRight />,
    menuFooterRender: () => <MenuFooter />,
    footerRender: () => <Footer />,
    menu: {
      locale: false,
      // 每当 initialState?.currentUser?.userid 发生修改时重新执行 request
      params: {
        userId: initialState?.currentUser?.userId,
      },
      request: async () => {
        if (!initialState?.currentUser?.userId) {
          return [];
        }
        const routers = await getRoutersInfo();
        console.log('routers', routers);
        return routers;
      },
    },
    navTheme: themeColor,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== PageEnum.LOGIN) {
        history.push(PageEnum.LOGIN);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    /** 系统设置选项 */
    // childrenRender: (children) => {
    //   // if (initialState?.loading) return <PageLoading />;
    //   return (
    //     <>
    //       {children}
    //       <SettingDrawer
    //         disableUrlParams
    //         enableDarkTheme
    //         settings={initialState?.settings}
    //         onSettingChange={(settings) => {
    //           setInitialState((preInitialState: any) => ({
    //             ...preInitialState,
    //             settings,
    //           }));
    //         }}
    //       />
    //     </>
    //   );
    // },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
const checkRegion = 5 * 60 * 1000;
// 使用节流函数处理清除授权
const clearAuth = (() => {
  let timer: NodeJS.Timeout | null = null;
  return (msg: string) => {
    if (timer) return;
    timer = setTimeout(() => {
      clearSessionToken();
      message.error(msg);
      history.push(PageEnum.LOGIN);
      timer = null;
    }, 300);
  };
})();

export const request = {
  timeout: 25000,
  ...errorConfig,
  requestInterceptors: [
    (config: any) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      console.log('response', response.config.url);
      const useResponse = async () => {
        const { code } = response.data;
        if (code === 401) {
          clearAuth('登陆已过期');
        }
        return response;
      };
      return useResponse();
    },
  ],
};
