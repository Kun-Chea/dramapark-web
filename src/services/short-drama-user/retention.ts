import { request } from '@umijs/max';

// 获取用户留存统计列表
export function queryUserActiveData(params: Record<string, any>) {
  return request('/admin/drama/userActive/queryUserActiveData', {
    method: 'GET',
    params,
  });
}
