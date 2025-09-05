import { request } from '@umijs/max';

// 获取用户广告日志列表
export function listUserAdLog(params: Record<string, any>) {
  return request('/admin/movie/adLog/list', {
    method: 'GET',
    params,
  });
}
