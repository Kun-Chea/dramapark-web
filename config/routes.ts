/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  {
    path: '/account',
    routes: [
      {
        name: 'acenter',
        path: '/account/center',
        component: './User/Center',
      },
      {
        name: 'asettings',
        path: '/account/settings',
        component: './User/Settings',
      },
    ],
  },
  {
    name: '系统管理',
    path: '/system',
    routes: [
      {
        name: '字典数据',
        path: '/system/dict-data/index/:id',
        component: './System/DictData',
      },
      {
        name: '菜单管理',
        path: '/system/menu',
        component: './System/Menu',
      },
      {
        name: '部门管理',
        path: '/system/dept',
        component: './System/Dept',
      },
      {
        name: '岗位管理',
        path: '/system/post',
        component: './System/Post',
      },
      {
        name: '用户管理',
        path: '/system/user',
        component: './System/User',
      },
      {
        name: '分配用户',
        path: '/system/role-auth/user/:id',
        component: './System/Role/authUser',
      },
      {
        name: '角色管理',
        path: '/system/role',
        component: './System/Role',
      },
      {
        name: '字典管理',
        path: '/system/dict',
        component: './System/Dict',
      },
      {
        name: '参数配置',
        path: '/system/config',
        component: './System/Config',
      },
      {
        name: '通知公告',
        path: '/system/notice',
        component: './System/Notice',
      },
    ],
  },
  {
    name: '系统监控',
    path: '/monitor',
    routes: [
      {
        name: '任务日志',
        path: '/monitor/job-log/index/:id',
        component: './Monitor/JobLog',
      },
      {
        name: '在线用户',
        path: '/monitor/online',
        component: './Monitor/Online',
      },
      {
        name: '系统监控',
        path: '/monitor/server',
        component: './Monitor/Server',
      },
    ],
  },
  {
    name: '系统工具',
    path: '/tool',
    routes: [
      {
        name: '代码生成',
        path: '/tool/gen',
        component: './Tool/Gen',
      },
      {
        name: '导入表',
        path: '/tool/gen/import',
        component: './Tool/Gen/import',
      },
      {
        name: '编辑表',
        path: '/tool/gen/edit',
        component: './Tool/Gen/edit',
      },
    ],
  },
  {
    name: '短剧管理',
    path: '/movie',
    routes: [
      {
        name: '短剧列表',
        path: 'list',
        component: './Movie/Detail',
      },
      {
        name: '剧集管理',
        path: '/movie/video',
        component: './Movie/Video',
      },
      {
        name: '标签管理',
        path: 'tag',
        component: './Movie/Tag',
      },
      {
        name: '参数配置',
        path: 'moive-config',
        component: './Movie/Config',
      },
      {
        name: '分类管理',
        path: 'category',
        component: './Movie/Category',
      },
      {
        name: '短剧详情',
        path: '/movie/detail',
        component: './Movie/Detail',
      },
      {
        name: '地区管理',
        path: '/movie/area',
        component: './Movie/Area',
      },
      {
        name: '音迅管理',
        path: '/movie/audio',
        component: './Movie/Audio',
      },
      {
        name: '翻译',
        path: '/movie/translate',
        component: './Movie/Translate',
      },
      {
        name: '轮播图管理',
        path: '/movie/banner',
        component: './Movie/Banner',
      },
    ],
  },
  {
    name: '用户管理',
    path: '/shortDramaUser',
    routes: [
      {
        name: '收藏管理',
        path: '/shortDramaUser/collect',
        component: './ShortDramaUser/Collect',
      },
      {
        name: '观看历史',
        path: '/shortDramaUser/history',
        component: './ShortDramaUser/History',
      },
    ],
  },
  {
    name: '用户管理',
    path: '/short-drama-user',
    routes: [
      {
        name: '用户反馈',
        path: 'feedback',
        component: './ShortDramaUser/FeedBack',
      },
      {
        name: 'APP用户',
        path: 'app-user',
        component: './ShortDramaUser/AppUser',
      },
      {
        name: '用户行为日志',
        path: 'action-log',
        component: './ShortDramaUser/ActionLog',
      },
      {
        name: '广告回传日志',
        path: 'ad-log',
        component: './ShortDramaUser/AdLog',
      },
      {
        name: '用户广告日志',
        path: 'user-log',
        component: './ShortDramaUser/UserLog',
      },
    ],
  },
  {
    name: '页面配置',
    path: '/page-config',
    component: './PageConfig',
  },
  {
    name: 'APP管理',
    path: '/app',
    component: './APP',
  },
  {
    name: '投放管理',
    path: '/link',
    component: './Movie/Link',
  },
  {
    name: '用户留存统计',
    path: '/retention',
    component: './ShortDramaUser/Retention',
  },
];
