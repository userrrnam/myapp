import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import { history } from 'umi';
import type { RequestOptionsInit } from 'umi-request';
import { notification } from 'antd';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import Footer from '@/components/Footer';
import { getToken } from '@/utils/storage';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

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
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      // history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}
/**
 * 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  return {
    url,
    options: {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Token': getToken() || '',
      },
    },
  };
};
export const request: RequestConfig = {
  errorHandler: (error: any) => {
    const { response, data } = error;
    if (response && response.status) {
      if (response.status === 401 || response.status === 403) {
        // 登录过期 跳转登录
        history.replace({
          pathname: '/user/login',
        });
      } else if (response.status !== 200) {
        const { status } = response;
        notification.error({
          message: `${status}`,
          description: data?.errorMsg,
        });
        throw data?.errorMsg;
      } else {
        return response;
      }
    } else if (!response) {
      notification.error({
        description: '您的网络发生异常，无法连接服务器',
        message: '网络异常',
      });
    }
  },
  requestInterceptors: [authHeaderInterceptor],
};
// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      console.log(initialState?.currentUser, location.pathname);
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },
    ...initialState?.settings,
  };
};
