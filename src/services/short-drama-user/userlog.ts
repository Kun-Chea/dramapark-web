import { request } from '@umijs/max';

// 获取用户广告日志列表
export function listUserLog(params: Record<string, any>) {
  return request('/admin/drama/log/list', {
    method: 'GET',
    params,
  });
}
